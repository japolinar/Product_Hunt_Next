export default function validarCrearProducto(valores){
    
    let errores = {};

    //Validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = "El nombre es obligatorio"
    }


    // validar empresa
    if(!valores.empresa){
        errores.empresa = "Nombre de la empresa es obligatorio"
    }

    // validar la URL
    if(!valores.url){
        errores.url = "La URL del producto es obligatorio"
    }else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ){
        errores.url = "La URL del producto no es correcto"
    }

    // validar Descripcion
    if(!valores.descripcion){
        errores.descripcion = "La descripcion es obligatorio"
    }    

    return errores;

}