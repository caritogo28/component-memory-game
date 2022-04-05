import React, {useState, Fragment} from 'react';
import styles from "./MemoryGame.css";

const MemoryGame = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);

    const closeModal = () => {
        setIsOpenModal(false)
    }

    var config,

        // {NodeList} - Almacena los nodos celda de la cuadrícula.
        cells,

        // {Array} - Almacena la pareja actualmente seleccionada. Cada
        //           elemento se representa con un objeto literal con
        //           tres propiedades: El nodo "celda", el nodo "imagen",
        //           y el nombre de la imagen.
        couple = [],

        // {Boolean} - Bandera de bloqueo para evitar que se seleccionen más de
        //             dos imágenes al mismo tiempo.
        locked = false;


    config = {
        themesPath: '/arquivos/',
        currentTheme: 'superheroes',
        themes: {
            superheroes: {
                suffix: 'sph',
                ext: '.jpg'
            }
        }
    };

    function start () {
        setTimeout(()=> {
            cells = document.querySelectorAll('.pilatos21-memory-game-0-x-gridCell');
    
            for (var i = 0; i < cells.length; i++) {
                cells[i].addEventListener('click', clickHandler, false);
            }
    
            setImages(config, cells);
        },500)
    }
    start()

    //---------------------------- Funciones -----------------------------------

    /**
     * Crea imágenes y las añade a las celdas.
     * @param {Object} config - rutas y descripción de las imágenes.
     * @param {NodeList} cells - Las celdas de la cuadrícula.
     */
    function setImages(config, cells) {
        var size = cells.length,
            half = size / 2,
            set1 = createRandomSet(half),
            set2 = createRandomSet(half),
            img1,
            img2,
            i;

        for (i = 0; i < size; i += 2) {
            img1 = `<img src='${createImgPath(config, set1[i / 2])}' draggable = false />`;
            img2 = `<img src='${createImgPath(config, set2[i / 2])}' draggable = false />`;
            cells[i].innerHTML = img1;
            cells[i + 1].innerHTML = img2;
        }
    }

    /**
     * Crea ruta de una imagen.
     * @param {Object} config - rutas y descripción de las imágenes.
     * @param {Number} n - el número identificador de la imagen.
     */
    function createImgPath(config, n) {
        var currentTheme, themes;

        themes = config.themes;
        currentTheme = config.currentTheme;

        return config.themesPath +
                themes[currentTheme].suffix +
                n + themes[currentTheme].ext;
    }

    /**
     * Crea un array con números aleatorios no repetidos empezando por 1.
     * @param {Number} size - el tamaño del array.
     */
    function createRandomSet(size) {
        var xs, i, j, k;

        for (i = 1, xs = []; i <= size; i++) {
            xs[i - 1] = i;
        }

        i = size;
        while (i > 1) {
            i--;
            j = Math.random() * i | 0;
            k = xs[i];
            xs[i] = xs[j];
            xs[j] = k;
        }

        return xs;
    }

    /**
     * Manejador del evento 'click'.
     */
    function clickHandler() {
        var self = this,
            img,
            imgName,
            item1,
            item2;

        if (!locked) {
            self.removeEventListener('click', clickHandler, false);
            img = self.firstElementChild;
            img.style.opacity = 1;
            imgName = img.src.split('/').pop();
            couple.push({cell: self, img: img, imgName: imgName});

            if (couple.length === 2) {
                locked = true;
                item1 = couple.pop();
                item2 = couple.pop();

                if (item1.imgName === item2.imgName) {
                    locked = false;
                    verificarFin()
                } else {
                    setTimeout(function() {
                        item1.cell.addEventListener('click', clickHandler, false);
                        item2.cell.addEventListener('click', clickHandler, false);
                        item1.img.style.opacity = 0;
                        item2.img.style.opacity = 0;
                        locked = false;
                    }, 700);
                }
            }
        }
    }

    function verificarFin() {
        var total = 0
        let tarjetas = document.querySelectorAll(".pilatos21-memory-game-0-x-gridCell img");
        tarjetas.forEach(tarjeta=>{
            if (tarjeta.style.opacity == 1) {
                total ++
            }
        })

        if (total == 12) {
            setIsOpenModal(true)
        }
    }

    return (
        <Fragment>
            <div className={styles.container}>
                <h1>El juego de las parejas</h1>
                <div className={styles.gridContainer}>
                    {(() => {
                        const options = [];

                        for (let i = 1; i <= 12; i++) {
                            options.push(<div className={`${styles.gridCell} ${i}`}></div>);
                        }
                        return options;
                    })()}       
                </div>
            </div>

            {isOpenModal ? 
                <div className={styles.popupOpen}>
                    <div className={styles.popupContainer}>
                        <p className={styles.popupCloseIcon} onClick={closeModal}>
                           X
                        </p>
                        <div className={styles.popupContainerMessage}>
                            <h2>¡GANASTE!</h2>
                            <p><strong>Tienes 15% EXTRA</strong> <br></br>
                                Ingresa el cupón MEMORYPILATOS en el carrito de compras. <br></br>
                                <small>El código debe ser ingresado en el carrito de compras en la opción SUMAR CUPÓN DE DESCUENTO. Aplican TyC.</small>
                            </p>
                            <div className={styles.popupContainerButton}>
                                <p onClick={closeModal}>Reiniciar juego</p>
                                <p onClick={closeModal}>Cerrar</p>
                            </div> 
                        </div>
                    </div>
                </div>
                : 
                null
            }
        </Fragment>
    )
}

export default MemoryGame