import "./style.css";
import { Formik, Form, Field } from "formik";
import Axios from "axios";
import { useState } from "react";

function Login() {
  const [saldoAtual, setSaldoAtual] = useState(0.0);
  const [style, setStyle] = useState("blur");
  const [extratoSaque, setExtratoSaque] = useState([]);
  const [extratoDeposito, setExtratoDeposito] = useState([]);
  const [autenticado, setAutenticado] = useState(false);
  const [tranferenciaEnviadas, setTransferenciaEnviadas] = useState([]);
  const [tranferenciaRecebidas, setTransferenciaRecebidas] = useState([]);

  const logout = () => {
    setSaldoAtual(0.0);
    setStyle("dark");
    setExtratoSaque([]);
    setExtratoDeposito([]);
    setAutenticado(false);
  };
  const esconderExtrato = () => {
    setExtratoDeposito([]);
    setExtratoSaque([]);
    setTransferenciaEnviadas([]);
    setTransferenciaRecebidas([]);
  };
  const handleClickLogin = async (values) => {
    try {
      await Axios.post("http://localhost:3001/login", {
        contaCorrente: values.contaCorrente,
        senha: values.senha,
      }).then((response) => {
        if (response.data.length === 0) {
          alert("Credenciais inválidas");
          return;
        }
        setAutenticado(true);
      });
    } catch (error) {
      alert("Login Error");
    }
  };

  const changeStyle = async () => {
    try {
      await Axios.get("http://localhost:3001/getSaldo").then((response) => {
        setSaldoAtual(response.data[0].saldo);
      });
    } catch (error) {
      alert("Digite a conta corrente e a senha");
    }

    console.log("you just clicked");
    if (style !== "light") setStyle("light");
    else setStyle("blur");
  };

  const handleClickDeposit = async (values) => {
    try {
      await Axios.post("http://localhost:3001/deposito", {
        valor: values.valor,
        descricao: values.descricao,
      }).then((response) => {
        console.log(response);
      });
    } catch (error) {
      alert("Depósito Error");
    }
  };
  const handleClickSaque = async (values) => {
    try {
      await Axios.post("http://localhost:3001/saque", {
        valor: values.valor,
      }).then((response) => {
        console.log(response);
      });
    } catch (error) {
      alert("Saque Error");
    }
  };

  const handleClickTransfer = async (values) => {
    try {
      await Axios.post("http://localhost:3001/transferencia", {
        contaCorrente: values.contaCorrente,
        valor: values.valor,
        descricao: values.descricao,
      }).then((response) => {
        console.log(response);
      });
    } catch (error) {
      alert("Transferência Error");
    }
  };

  const handleClickExtrato = async () => {
    try {
      await Axios.get("http://localhost:3001/extratoSaque").then((response) => {
        setExtratoSaque(response.data);
      });
      await Axios.get("http://localhost:3001/extratoDeposito").then(
        (response) => {
          setExtratoDeposito(response.data);
        }
      );
      await Axios.get(
        "http://localhost:3001/extratoTransferenciaEnviadas"
      ).then((response) => {
        setTransferenciaEnviadas(response.data);
      });
      await Axios.get(
        "http://localhost:3001/extratoTransferenciaRecebidas"
      ).then((response) => {
        setTransferenciaRecebidas(response.data);
      });
    } catch (error) {
      alert("Erro em abrir extrato");
    }
  };

  return (
    <body>
      <div className="login">
        <div className="login-box">
          <h1>Login</h1>
          <Formik initialValues={{}} onSubmit={handleClickLogin}>
            <Form className="login-form">
              <div className="login-form-group">
                <Field
                  name="contaCorrente"
                  className="form-field"
                  placeholder="Conta-Corrente"
                />
              </div>
              <div className="login-form-group">
                <Field
                  name="senha"
                  className="form-field"
                  placeholder="Senha"
                />
              </div>
              <button className="button" type="submit">
                Login
              </button>
            </Form>
          </Formik>
          <button className="button" onClick={logout}>
            Logout
          </button>
        </div>

        {autenticado && (
          <div className="deposito">
            <h1>Depósito</h1>
            <Formik initialValues={{}} onSubmit={handleClickDeposit}>
              <Form className="deposito-form">
                <div className="deposito-form-group">
                  <Field
                    name="valor"
                    className="form-field"
                    placeholder="Valor a enviar"
                  />
                </div>
                <div className="deposito-form-group">
                  <Field
                    name="descricao"
                    className="form-field"
                    placeholder="Descrição"
                  />
                </div>
                <button className="button" type="submit">
                  Submit
                </button>
              </Form>
            </Formik>
          </div>
        )}
        {autenticado && (
          <div className="saque">
            <h1>Saque</h1>
            <Formik initialValues={{}} onSubmit={handleClickSaque}>
              <Form className="saque-form">
                <div className="saque-form-group">
                  <Field
                    name="valor"
                    className="form-field"
                    placeholder="Valor a sacar"
                  />
                </div>
                <button className="button" type="submit">
                  Submit
                </button>
              </Form>
            </Formik>
          </div>
        )}

        {autenticado && (
          <div>
            <div className={style}>
              <h1>SALDO</h1>
              {typeof saldoAtual !== "undefined" && <h3>R${saldoAtual}</h3>}
            </div>
            <button className="button" onClick={changeStyle}>
              Mostrar/Atualizar saldo
            </button>
          </div>
        )}
      </div>
      {autenticado && (
        <div className="transferencia">
          <h1>Transferência</h1>
          <Formik initialValues={{}} onSubmit={handleClickTransfer}>
            <Form className="transferencia-form">
              <div className="transferencia-form-group">
                <Field
                  name="contaCorrente"
                  className="form-field"
                  placeholder="Conta corrente destino"
                />
              </div>

              <div className="transferencia-form-group">
                <Field
                  name="valor"
                  className="form-field"
                  placeholder="Valor a enviar"
                />
              </div>

              <div className="transferencia-form-group">
                <Field
                  name="descricao"
                  className="form-field"
                  placeholder="Descrição"
                />
              </div>
              <button className="button" type="submit">
                Submit
              </button>
            </Form>
          </Formik>
        </div>
      )}
      {autenticado && (
        <div className="extrato">
          <h1>Extrato</h1>

          <div className="movimentacao">
            <h2>SAQUES</h2>
            {extratoSaque.map((item, i) => (
              <div key={i}>
                <h3>
                  Valor Sacado: R${item.valor_saque} <br />
                  Data: {item.data_hora}
                </h3>
              </div>
            ))}
            <h2>DEPÓSITOS</h2>
            {extratoDeposito.map((item, i) => (
              <div key={i}>
                <h3>
                  Conta Destino: {item.conta_destino}
                  <br />
                  Valor Depositado: R${item.valor_deposito}
                  <br />
                  Data: {item.data_hora}
                  <br />
                  Descrição: {item.descricao}
                </h3>
              </div>
            ))}
            <h2>TRANSFERÊNCIAS ENVIADAS</h2>
            {tranferenciaEnviadas.map((item, i) => (
              <div key={i}>
                <h3>
                  Conta Destino: {item.conta_destino}
                  <br />
                  Valor Depositado: R${item.valor_transferencia}
                  <br />
                  Data: {item.data_transferencia}
                  <br />
                  Descrição: {item.descricao}
                  <br />
                  Taxa de Transferência: R${item.taxa_transferencia}
                </h3>
              </div>
            ))}
            <h2>TRANSFERÊNCIAS RECEBIDAS</h2>
            {tranferenciaRecebidas.map((item, i) => (
              <div key={i}>
                <h3>
                  Conta Destino: {item.conta_destino}
                  <br />
                  Valor Depositado: {item.valor_transferencia}
                  <br />
                  Data: {item.data_transferencia}
                  <br />
                  Descrição: {item.descricao}
                </h3>
              </div>
            ))}
          </div>

          <button className="button" onClick={handleClickExtrato}>
            Abrir
          </button>
          <button className="button" onClick={esconderExtrato}>
            Fechar
          </button>
        </div>
      )}
    </body>
  );
}

export default Login;
