import './style.css';

function ExtratoSaque(props){
    return(
        <div className='movimentacao'>
                <h2>Saques</h2>
                <h3>Valor Sacado:{props.valor_sacado}</h3>
                <h3>Data:{props.data_hora}</h3>
        </div>
    )
}

export default ExtratoSaque;