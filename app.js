//DEFINICIÓN DE LAS CLASES
class Pelicula{
    constructor(titulo, genero, director, codigo){
        this.titulo=titulo;
        this.genero=genero;
        this.director=director;
        this.codigo=codigo;

    }
}


class UI{
    static mostrarPeliculas(){
        const peliculas = Datos.traerPeliculas();
        peliculas.forEach((pelicula) => UI.agregarPeliculaLista(pelicula));
    }

    static agregarPeliculaLista(pelicula){
        const lista = document.querySelector('#pelicula-list');
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${pelicula.titulo}</td>
            <td>${pelicula.genero}</td>
            <td>${pelicula.director}</td>
            <td>${pelicula.codigo}</td>
            <td><a href= "#" class= "btn btn-danger btn-sm delete"</a>X</td>
        `;

        lista.appendChild(fila);

    }

    static eliminarPelicula(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();    
        }
    }

    static mostrarAlerta(mensaje, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensaje));

        const container = document.querySelector('.container');
        const form = document.querySelector('#pelicula-form');
        container.insertBefore(div,form);

        setTimeout(() => document.querySelector('.alert').remove(),3000);
    }

    static limpiarCampos(){
        document.querySelector('#titulo').value = '';
        document.querySelector('#genero').value = '';
        document.querySelector('#director').value = '';
        document.querySelector('#codigo').value = '';
    }
}


class Datos{
    static traerPeliculas(){
        let peliculas;
        //Si en memoria no hay peliculas devuelve el arreglo vacio
        if(localStorage.getItem('peliculas') === null){
            peliculas = [];
        }else{
            peliculas= JSON.parse(localStorage.getItem('peliculas'));
        }//Si hay peliculas, convierte el texto en memoria a un OBJ con JSON

        return peliculas;
    }

    static agregarPelicula(pelicula){
        const peliculas = Datos.traerPeliculas();
        peliculas.push(pelicula);
        localStorage.setItem('peliculas',JSON.stringify(peliculas));

    }

    static removerPelicula(codigo){
        const peliculas = Datos.traerPeliculas();

        peliculas.forEach((pelicula, index) => {
            if(pelicula.codigo === codigo){
                peliculas.splice(index,1);
            }
        });
        localStorage.setItem('peliculas', JSON.stringify(peliculas));
    }

}

//Cuando Carga La Página
document.addEventListener('DOMContentLoaded',UI.mostrarPeliculas());



//Controla el evento submit
document.querySelector('#pelicula-form').addEventListener('submit',(e) =>{
    e.preventDefault();

    //Obtener valores de los campos
    const titulo = document.querySelector('#titulo').value;
    const genero = document.querySelector('#genero').value;
    const director = document.querySelector('#director').value;
    const codigo = document.querySelector('#codigo').value;

    if(titulo === '' || genero === '' || director === '' || codigo === ''){
        UI.mostrarAlerta('Por favor complete todos los campos','danger');
    }else{
        const pelicula = new Pelicula(titulo,genero,director,codigo);
        Datos.agregarPelicula(pelicula);
        UI.agregarPeliculaLista(pelicula);
        UI.mostrarAlerta('Pelicula En Lista De Espera!','success')
        UI.limpiarCampos();
    }
});

document.querySelector('#pelicula-list').addEventListener('click',(e) =>{
    UI.eliminarPelicula(e.target);
    Datos.removerPelicula(e.target.parentElement.previousElementSibling.textContent);
    UI.mostrarAlerta(`${e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent} Fue Eliminada Exitosamente!`, 'success');  
});