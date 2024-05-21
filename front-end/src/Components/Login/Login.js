import './style.css';
import {Formik, Form, Field} from "formik";
import Axios from "axios";
import { useState } from 'react';

//import ExtratoSaque from '../ExtratoSaque/ExtratoSaque';


function Login() {

  const handleClickLogin = async (values) => {
     await Axios.post("http://localhost:3001/login", {
      contaCorrente: values.contaCorrente,
      senha: values.senha,
    }).then((response) => {
      console.log(response);
    });
  };
  
  const [money, setMoney] = useState();
  const [style,setStyle] = useState("dark");
    const changeStyle = async () => { 
      await Axios.get("http://localhost:3001/getSaldo").then((response) => {
        setMoney(response.data[0].saldo);
        
      });
        console.log("you just clicked");
        if (style !== "light") setStyle("light");
        else setStyle("dark");
    };

    const handleClickDeposit = async (values) =>{
       await Axios.post("http://localhost:3001/deposito", {
        valor: values.valor,
        descricao: values.descricao,

      }).then((response) => {
        console.log(response);
      });
    };
    const handleClickSaque =  async (values) =>{
      await Axios.post("http://localhost:3001/saque", {
        valor: values.valor,

      }).then((response) => {
        console.log(response);
      });
    };

    const [extrato, setExtrato] = useState();
    const handleClickExtrato = async () => {
      await Axios.get("http://localhost:3001/extratoSaque").then((response) => {
        setExtrato(response);
        console.log(extrato);
        });
      };

  return (
    <body>
      <div className='login'>
        <div className="login-box">
          <h1>Login</h1>
          <Formik
           initialValues={{}}
           onSubmit={handleClickLogin}
          >
            <Form className='login-form'>
                <div className='login-form-group'>
                    <Field name = "contaCorrente"
                    className = "form-field"
                    placeholder = "Conta-Corrente"
                    />
                </div>
      
                <div className='login-form-group'>
                      <Field name = "senha"
                      className = "form-field"
                      placeholder = "Senha"
                      />
                </div>
      
                <button
                    className='submit-login-button'
                    type='submit'>
                Submit
                </button>
                </Form>
           </Formik>
        </div>
      
            <div className='deposito'>
              <h1>Depósito</h1>
              <Formik
              initialValues = {{}}
              onSubmit={handleClickDeposit}
              >
                  <Form className='deposito-form'>
                      <div className='deposito-form-group'>
                         <Field name = "valor"
                          className = "form-field"
                          placeholder = "Valor a enviar"
                         />
                      </div>
                      <div className='deposito-form-group'>
                         <Field name = "descricao"
                          className = "form-field"
                          placeholder = "Descrição"
                         />
                      </div>
                      <button
                          className='submit-login-button'
                          type='submit'>
                          Submit
                      </button>
                  </Form>
              </Formik>
            </div>
          <div className='saque'>
              <h1>Saque</h1>
              <Formik
              initialValues = {{}}
              onSubmit={handleClickSaque}
              >
                  <Form className='saque-form'>
                      <div className='saque-form-group'>
                         <Field name = "valor"
                          className = "form-field"
                          placeholder = "Valor a sacar"
                         />
                      </div>
                      <button
                          className='submit-login-button'
                          type='submit'>
                          Submit
                      </button>
                  </Form>
              </Formik>
          </div>
          <div className={style}
                onClick={changeStyle}
            >
               <h1>SALDO</h1>
                {typeof money !== "undefined" && <h3>R${money}</h3>}
            </div>
        </div>
        
        <div className='extrato'>
          <h1>Extrato</h1> 
          <div className='movimentacao'>
          </div>
          <button
            className='submit-login-button'
            onClick={handleClickExtrato}
            >
            Mostrar Extrato
          </button>
        </div>
    </body>
  );
}

export default Login;
