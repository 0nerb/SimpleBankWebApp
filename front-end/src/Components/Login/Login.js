import "./style.css";
import { Formik, Form, Field } from "formik";
import Axios from "axios";
import { useState } from "react";

//import ExtratoSaque from '../ExtratoSaque/ExtratoSaque';

function Login() {
  const [money, setMoney] = useState(0.0);
  const [style, setStyle] = useState("dark");
  const [extrato, setExtrato] = useState([]);
  const [autenticado, setAutenticado] = useState(false);

  const logout = () =>{
    setMoney(0.0)
    setStyle("dark")
    setExtrato([])
    setAutenticado(false)
  } 

  const handleClickLogin = async (values) => {
    await Axios.post("http://localhost:3001/login", {
      contaCorrente: values.contaCorrente,
      senha: values.senha,
    }).then((response) => {
      if(response.data.length === 0){
        alert("Credenciais inválidas")
        return
      }
      setAutenticado(true)
    });
  };

  const changeStyle = async () => {
    try {
      await Axios.get("http://localhost:3001/getSaldo").then((response) => {
        setMoney(response.data[0].saldo);
      });
    } catch (error) {
      alert("Digite a conta corrente e a senha");
    }

    console.log("you just clicked");
    if (style !== "light") setStyle("light");
    else setStyle("dark");
  };

  const handleClickDeposit = async (values) => {
    await Axios.post("http://localhost:3001/deposito", {
      valor: values.valor,
      descricao: values.descricao,
    }).then((response) => {
      console.log(response);
    });
  };
  const handleClickSaque = async (values) => {
    await Axios.post("http://localhost:3001/saque", {
      valor: values.valor,
    }).then((response) => {
      console.log(response);
    });
  };

  const handleClickExtrato = async () => {
    try {
      await Axios.get("http://localhost:3001/extratoSaque").then((response) => {
        setExtrato(response.data);
        //console.log(extrato);
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
              <button className="submit-login-button" type="submit">
                Login
              </button>
            </Form>
          </Formik>
          <button className="submit-login-button" onClick={logout}>
            Logout
          </button>
        </div>
      

          {autenticado && 
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
              <button className="submit-login-button" type="submit">
                Submit
              </button>
            </Form>
          </Formik>
        </div>


        }
        {autenticado &&
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
              <button className="submit-login-button" type="submit">
                Submit
              </button>
            </Form>
          </Formik>
        </div>
        }

        
        {autenticado &&
        <div className={style} onClick={changeStyle}>
          <h1>SALDO</h1>
          {typeof money !== "undefined" && <h3>R${money}</h3>}
          </div>
        }
      </div>
        
        {autenticado &&
      <div className="extrato">
        <h1>Extrato</h1>

        <div className="movimentacao">
          {extrato.map((item, i) => (
            <tr key={i}>
              <td>Valor Sacado: {item.valor_saque}</td>
              <td>Data: {item.data_hora}</td>
            </tr>
          ))}
        </div>

        <button className="submit-login-button" onClick={handleClickExtrato}>
          Mostrar Extrato
        </button>
          
      </div>
      }

    </body>
  );
}

export default Login;
