import './style.css'
import {Formik, Form, Field} from "formik";
import Axios from "axios";

function Transfencia(){

    const handleClickTransfer = (values) => {
        Axios.post("http://localhost:3001/tranferencia", {
          contaCorrente: values.contaCorrente,
          valor: values.valor,
          descricao: values.descricao,
        }).then((response) => {
          console.log(response);
        });
      };
    

    return(
        <div className='transferencia'>
            <h1>Transferência</h1>
            <Formik 
            initialValues = {{}}
            onSubmit={handleClickTransfer}

            >
                <Form className='transferencia-form'>
                    <div className='transferencia-form-group'>
                       <Field name = "contaCorrente"
                        className = "form-field"
                        placeholder = "Conta-Corrente"
                       />
                    </div>
                    <div className='transferencia-form-group'>
                       <Field name = "valor"
                        className = "form-field"
                        placeholder = "Valor a enviar"
                       />
                    </div>
                    <div className='transferencia-form-group'>
                       <Field name = "descricao"
                        className = "form-field"
                        placeholder = "Descrição"
                       />
                    </div>
                    <button
                        className='submit-deposito-button'
                        type='submit'>
                        Submit
                    </button>
                </Form>
            </Formik>
        </div>
    )
}

export default Transfencia;