const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
//const axios = require("axios");

//conecta com o Banco de Dados
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "conta_corrente",
});

app.use(express.json());
app.use(cors());

//Pega a data e hora local
const dNow = new Date();
const DiaHora = ( dNow.getMonth() + 1 ) + '/' + dNow.getDate() + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();

let contaCorrenteglobal;
let Senhaglobal;

//validação do login
app.post("/login", (req, res) => {
  const contaCorrente = req.body.contaCorrente;
  const senha = req.body.senha;
  contaCorrenteglobal = contaCorrente;
  Senhaglobal = senha;
  db.query(
    "SELECT * FROM contas WHERE conta_corrente = ? AND senha = ?",
    [contaCorrente, senha],
    (err, result) => {
      if (err) {
        res.send(err).status(422);
      }
      res.send(result);
    }
  );
});
//busca o saldo da conta em login
app.get("/getSaldo", (req, res) => {
  const SQL = "SELECT saldo FROM contas WHERE conta_corrente = ? AND senha = ?";
  db.query(SQL, [contaCorrenteglobal, Senhaglobal], (err, result) => {
    if (err) console.error(err);
    else res.send(result);
  });
});
//Realiza os depositos
app.post("/deposito", (req, res) => {
  const valor = req.body.valor;
  const descricao = req.body.descricao;

  if (valor > 0){
  const SQL =
    "UPDATE contas SET saldo = saldo + ? WHERE conta_corrente = ? AND senha = ?";
  db.query(SQL, [valor, contaCorrenteglobal, Senhaglobal], (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
}
  const extratoDeposito =
    "INSERT INTO depositos (conta_destino, valor_deposito, data_hora, descricao) VALUES (?, ?, ?, ?)";
  db.query(
    extratoDeposito,
    [contaCorrenteglobal, valor, DiaHora, descricao],
    (err, result) => {
      if (err) console.log(err);
    }
  );
});

//faz os saques e atualiza no SQL
app.post("/saque", (req, res) => {
  const valor = req.body.valor;
  const SQL =
    "UPDATE contas SET saldo = saldo - ? WHERE conta_corrente = ? AND senha = ?";
  const sqlSaldo =
    "SELECT saldo FROM contas WHERE conta_corrente = ? AND senha = ?";
  const VIPCheck = "SELECT VIP FROM contas WHERE conta_corrente = ?";
  db.query(sqlSaldo, [contaCorrenteglobal, Senhaglobal], (err, result) => {
    if (err) console.log(err);
    const data = JSON.parse(JSON.stringify(result));
    const saldo = data[0].saldo;
    db.query(VIPCheck, [contaCorrenteglobal], (err, result) => {
      if (err) console.log(err);
      const data = JSON.parse(JSON.stringify(result));
      const IsVip = data[0].VIP;
      //validação se for VIP
      if (saldo > valor || IsVip === 1) {
        db.query(
          SQL,
          [valor, contaCorrenteglobal, Senhaglobal],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
            }
          }
        );
        const extratoSaque =
          "INSERT INTO saques (conta_origem, valor_saque, data_hora) VALUES (?, ?, ?)";

        db.query(
          extratoSaque,
          [contaCorrenteglobal, valor, DiaHora],
          (err, result) => {
            if (err) console.log(err);
          }
        );
      }
    });
  });
});
//busca no SQL o histórico de depositos
app.get("/extratoDeposito", (req, res) => {
  const SQL = "SELECT * FROM depositos WHERE conta_destino = ?;";
  db.query(SQL, [contaCorrenteglobal], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//busca no SQL o histórico de saques
app.get("/extratoSaque", (req, res) => {
  const SQL = "SELECT * FROM saques WHERE conta_origem = ?;";
  db.query(SQL, [contaCorrenteglobal], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/extratoTransferenciaEnviadas", (req, res) => {
  const SQL = "SELECT * FROM transferencias WHERE conta_origem = ?;";
  db.query(SQL, [contaCorrenteglobal], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.get("/extratoTransferenciaRecebidas", (req, res) => {
  const SQL = "SELECT * FROM transferencias WHERE NOT conta_origem = ?;";
  db.query(SQL, [contaCorrenteglobal], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/transferencia", (req, res) => {
  const contaCorrente = req.body.contaCorrente;
  const valor = req.body.valor;
  const descricao = req.body.descricao;
  const taxaVIP =  (0, 8 / 100) * valor;
  const taxaNaoVIP = parseInt(valor) + 8;
  
  
  db.query(
    "SELECT saldo FROM contas WHERE conta_corrente = ? AND senha = ?",
    [contaCorrenteglobal, Senhaglobal],
    (err, result) => {
      if (err) console.log(err);

      const data = JSON.parse(JSON.stringify(result));
      const saldo = data[0].saldo;
      const VIPCheck = "SELECT VIP FROM contas WHERE conta_corrente = ?";

      db.query(VIPCheck, [contaCorrenteglobal], (err, result) => {
        if (err) console.log(err);
        const data = JSON.parse(JSON.stringify(result));
        const IsVip = data[0].VIP;

        if (saldo > valor && IsVip === 1) {
          
          const subtrairSaldo =
            "UPDATE contas SET saldo = saldo - ? WHERE conta_corrente = ?;";
          const adicionarSaldo =
            "UPDATE contas SET saldo = saldo + ? WHERE conta_corrente = ?;";
          const tranferencia =
            "INSERT INTO transferencias (conta_origem, conta_destino, data_transferencia, valor_transferencia, descricao, taxa_transferencia) VALUES (?, ?, ?, ?, ?, ?);";

          db.query(adicionarSaldo, [valor, contaCorrente], (err, result) => {
            if (err) {
              console.log(err);
            }

            db.query(
              tranferencia,
              [
                contaCorrenteglobal,
                contaCorrente,
                DiaHora,
                valor,
                descricao,
                taxaVIP,
              ],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send(result);
                }
              }
            );
            
            db.query(
              subtrairSaldo,
              [taxaVIP, contaCorrenteglobal],
              (err, result) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          });
        } if (saldo > valor && IsVip === 0 && valor < 1000){
            const adicionarSaldo =
            "UPDATE contas SET saldo = saldo + ? WHERE conta_corrente = ?;";
            const tranferencia =
            "INSERT INTO transferencias (conta_origem, conta_destino, data_transferencia, valor_transferencia, descricao, taxa_transferencia) VALUES (?, ?, ?, ?, ?, ?);";
            const subtrairSaldo =
              "UPDATE contas SET saldo = saldo - ? WHERE conta_corrente = ?;";

          db.query(adicionarSaldo, [valor, contaCorrente], (err, result) => {
            if (err) {
              console.log(err);
            }

            db.query(
              tranferencia,
              [
                contaCorrenteglobal,
                contaCorrente,
                DiaHora,
                valor,
                descricao,
                taxaNaoVIP,
              ],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send(result);
                }
              }
            );
           
            
            db.query(
              subtrairSaldo,
              [taxaNaoVIP, contaCorrenteglobal],
              (err, result) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          });
        }
      });
    }
  );
});

app.listen(3001);
