import { Collapse } from 'antd';
import './index.css'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const { Panel } = Collapse;

function Instructions() {
    const navigate = useNavigate()
    return (
        <div className="container">
            <div className='back-home-button instructions-logo'>
                <div className='logo-container-nav'>
                    <img src="Facturama-name.png" alt="" />
                </div>
                <button onClick={()=>navigate('/')}>Volver</button>
            </div>
            <h1 className='instructions-title'>
                <span className='instructions-icon'>
                    <FontAwesomeIcon icon={faComments} /> 
                </span>
                Preguntas frecuentes 
            </h1>
            <div className='accordion-container'>
                <Collapse accordion>
                    <Panel header="¿Como instalar OpenSSL?" key="1">
                        <div>
                            OpenSSL es un programa que permite la creación de certificados y claves privadas. Al estar delegando la responsabilidad de facturación a Factugram, es necesario 
                            otorgarle tanto la clave privada como el certificado para que AFIP pueda autorizar las operaciones

                            <ol>
                                <li>
                                    <a className='instructions-link' href="https://slproweb.com/download/Win64OpenSSL_Light-3_1_0.exe"> Descargar OpenSSL</a> para windows 
                                </li>
                                <li>
                                    Una vez finalizada la descarga, seguir el proceso de instalación. Una vez instalado preguntará si se desea donar, se puede finalizar la instalación.
                                </li>
                                <li>
                                    Para poder utilizarlo, es necesario agregar OpenSSL a las variables de entorno. Para esto hacemos click en el boton de windows y escribimos "variables de entorno" y seleccionamos la primera opción.
                                </li>
                                <li>
                                    Se abrira la siguiente ventana
                                    <div className='instructions-img'>
                                        <img src="variables-de-entorno.png" alt="Imágen de editor de variables de entorno" />
                                    </div>
                                    Seleccionamos <i>Variables de entorno...</i>
                                </li><br />
                                <li>
                                    Se abrira la siguiente ventana y haremos doble click en <i>Path</i>
                                    <div className='instructions-img'>
                                        <img src="editar-variable-de-entorno.png" alt="Imágen de editor de variables de entorno" />
                                    </div>
                                </li><br />
                                <li>
                                    En la ventana que se abrirá, seleccionaremos nuevo e introduciremos la direccion de instalación de OpenSSL, si no se ha modificado la del inicio sería "C:\Program Files\OpenSSL-Win64\bin"
                                    <div className='instructions-img'>
                                        <img src="save-env-variable.png" alt="Insertar variable de entorno" />
                                    </div>
                                </li>
                                <li>Una vez finalizado, podemos cerrar el editor de variables. Para probar que todo ha funcionado bien, podemos hacer click en el boton de windows y escribir "cmd" y presionar Enter. Esto nos abrirá la consola de windows</li>
                                <li>Al abrirse la consola, escribimos openssl y deberá aparecer <i>help: </i> y una lista de comandos posibles. De ser así, se ha instalado correctamente el programa. En el caso de no reconocer el comando, controle que openssl se haya instalado en la carpeta indicada en el Path.</li>
                                <li>Si te quedó alguna duda, acá te dejamos un <a target='_blank' className='instructions-link' href="https://www.youtube.com/watch?v=eLb0w1uGxUE">video</a> </li>
                            </ol>
                        </div>
                    </Panel>
                    <Panel header="¿Cómo crear un punto de venta en AFIP?" key="2">
                        <div>
                        Para comenzar a facturar electrónicamente, necesitás crear un punto de venta WebService en AFIP. Siguiendo los pasos a continuación podras crearlo
                            <ol>
                                <li>
                                    Iniciar sesion en <a className='instructions-link' href="https://www.afip.gob.ar/"> AFIP</a>
                                </li>
                                <li>
                                    En el buscador de <strong>Mis Servicios</strong>, hacé clic en Administración de puntos de venta y domicilios.
                                </li>
                                <li>
                                    Seleccioná la empresa o persona a representar
                                </li>
                                <li>
                                    Presioná en A/B/M de puntos de venta.
                                </li>
                                <li>
                                    Cerrá la ventana de notificacion y Hacé clic en Agregar para crear tu punto de venta.
                                </li>
                                <li>
                                    Completá los datos que aparecen en la ventana: <br />

                                    <strong>Número de punto de venta:</strong>  tiene que ser distinto a los que ya hayas creado (5 digitos). <br />
                                    <strong>Nombre de fantasía:</strong> nombre inventado para que puedas identificar el punto de venta. <br />
                                    <strong>Dominio asociado:</strong> puede quedar en blanco o con tu dominio. <br />
                                    <strong>Sistema:</strong> tenés que elegir una opción dependiendo de cuál sea tu condición tributaria:
                                        <ul>
                                            <li>
                                                Si sos MONOTRIBUTISTA elegí Factura Electrónica – Monotributo - WebServices
                                            </li>
                                            <li>
                                                Si sos RESPONSABLE INSCRIPTO elegí RECE para aplicativo y WebServices
                                            </li>
                                            <li>
                                                Si sos IVA EXENTO elegí Facturación Electrónica - exento en IVA - WebServices
                                            </li>
                                        </ul>
                                    <strong>Domicilio:</strong> Seleccioná el que corresponda al punto de venta. <br />

                                    Al terminar, presioná Aceptar.
                                </li>
                                <li>
                                    Presioná Sí para crearlo.
                                </li>
                                <li> Guardá el número de punto de venta ya que lo necesitás para agregar el cuit a Facturama</li>
                                <li>Si te quedó alguna duda, acá te dejamos un <a target='_blank' className='instructions-link' href="https://www.youtube.com/watch?v=Y7W3A8oYL9A">video</a> </li>
                            </ol>
                        </div>
                    </Panel>
                    <Panel header="¿Como conectar Facturama a un CUIT?" key="3">
                    <div>
                        Requisitos:
                        <ul>
                            <li>
                                Tener instalado OpenSSL
                            </li>
                            <li>
                                Contar con clave fiscal nivel 3
                            </li>
                            <li>
                                Contar con un punto de venta creado
                            </li>
                        </ul>
                        Procedimiento de creacion de certificado y clave privada:
                        <ol>
                            <li>
                                Primero necesitamos crear un certificado y una clave privada. Para ello, vamos a abrir la linea de comandos de Windows. Para abrirla, presionar el boton de windows de la barra de inicio, escribir "cmd" y presionar Enter
                            </li>
                            <li>
                                Una vez que la linea de comandos se ha abierto escribiremos <i>openssl genrsa -out MiClavePrivada 2048</i> donde MiClavePrivada es el nombre del archivo que se generará. Esto generará una clave privada aleatoria.
                            </li>
                            <li>
                                Ahora crearemos un Certificado csr. Para ello, abriremos nuevamente la linea de comandos si la hemos cerrado o en la misma y editaremos el comando a continuacion
                                <br />Donde cada uno de los terminos previos significan 
                                <ol>
                                    <li>MiClavePrivada por nombre del archivo elegido en el primer paso.</li>
                                    <li>subj_o por el nombre de su empresa o tu nombre y apellido todo junto</li>
                                    <li>facturama por el nombre de su sistema cliente</li>
                                    <li>subj_cuit por la CUIT (sólo los 11 dígitos, sin guiones) de la empresa o de la persona jurídica</li>
                                    <li>MiClavePrivada por el nombre del archivo de la clave privada generado antes</li>
                                    <li>MiPedidoCSR por el nombre del archivo CSR que se va a crear</li>
                                </ol>
                                El comando es el siguiente: <br />
                                <i>openssl req -new -key MiClavePrivada -subj "/C=AR/O=subj_o/CN=facturama/serialNumber=CUIT subj_cuit" -out MiPedidoCSR</i>
                            </li>
                            <li>Al finalizar esto, tendremos generada nuestra clave privada y certificado para ingresar en AFIP. Es importante ver la direccion en donde estamos ubicados para poder copiar los archivos.</li>
                        </ol>
                        Procedimiento de autorización AFIP
                        <ol>
                            <li>
                                Iniciar sesion en <a className='instructions-link' href="https://www.afip.gob.ar/"> AFIP</a>
                            </li>
                            <li>Si dentro de mis servicios tenemos <i>Administración de Certificados</i> podemos saltear los siguientes 3 pasos</li>
                            <li>Para incluir el servicio de Administración de Certificados, iremos a <i>Administrador de relacion de clave fiscal</i> y haremos click en <i>Adherir servicio</i> y en el formulario seleccionaremos el cuit si es necesario y le daremos a Buscar</li>
                            <li>
                                Dentro de todas las opciones, abriremos la primera <i>AFIP</i>, luego <i>Servicios interactivos</i> y buscaremos <i>Administración de Certificados Digitales</i> y al seleccionarlo le daremos a continuar para que nos agregue el servicio 
                            </li>
                            <li>Una vez finalizado esto volveremos a la pagina principal de AFIP y refrezcaremos</li>
                            <li>
                                En mis servicios, ir a la seccion <i>Administración de Certificados</i>
                            </li>
                            <li>
                                Seleccionar en <i>agregar alias</i>
                            </li>
                            <li>
                                Introducir el nombre deseado para el alias, inventado.
                            </li>
                            <li>
                                Seleccionar el archivo CSR que hemos generado en el ultimo paso anterior.
                            </li>
                            <li>
                                Al confirmar, se creará el alias y lo <strong>descargaremos</strong>. Luego le tendremos que dar los permisos correspondientes.
                            </li>
                            <li>
                                Para otorgar permisos al certificado, iremos nuevamente a la seccion <i>Administrador de relacion de clave fiscal</i>
                            </li>
                            <li>Haremos click en <i>Nueva relacion</i> y luego en <i>Buscar</i></li>
                            <li>Nuevamente iremos a <i>AFIP</i> y seleccionaremos <i>WebServices</i></li>
                            <li>Buscamos la opcion <i>Facturacion Electronica</i> y la seleccionamos</li>
                            <li>En las opciones que se muestran, en Representante, seleccionaremos <i>Buscar</i> y en computador fiscal seleccionaremos el certificado creado previamente</li>
                            <li>Una vez hecho esto le damos a confirmar y se termina el proceso de autorización</li>
                        </ol>
                        Alta de cuit en Facturama
                        <ol>
                            <li>Iniciamos sesion en Facturama</li>
                            <li>En el menu de arriba a la derecha seleccionaremos <i>Agregar nuevo</i></li>
                            <li>Completaremos todos los campos del formulario. Para insertar el certificado y la clave privada, buscaremos en nuestra computadora el fichero creado al principio con la clave privada</li>
                            <li>Una vez que lo hemos encontrado, le damos click derecho y abrimos con block de notas. De esta forma podremos ver el contenido, lo copiamos y lo pegamos en el formulario</li>
                            <li>Para el certificado, buscaremos donde lo hemos descargado haremos lo mismo, click derecho, abrir con block de notas. Copiaremos el contenido del mismo y lo pegaremos en el formulario</li>
                            <li>Con todo esto hecho, ya podemos comenzar a facturar masivamente en el cuit indicado</li>
                        </ol>
                    </div>
                    </Panel>
                    <Panel header="¿Como generar de forma masiva las facturas?" key="4">
                    <div>
                        En la pagina principal encontrará la tabla con todas las facturas registradas hasta el momento. Sobre ella, encontrará dos botones. Crear masivamente y crear factura.
                        Para crear masivamente las facturas, haremos click en crear masivamente. Se abrirá una ventana en donde tendrá que descargar el excel modelo para la creación de facturas. En este excel completará los siguientes campos:
                        <ul>
                            <li><strong>Fecha (opcional): </strong>Indicar la fecha de la factura. En el caso de no indicarse una fecha, se le asignara la del día. <strong>IMPORTANTE:</strong> La fecha mas antigua del archivo debe ser mayor a la ultima factura creada ya que AFIP no permite la creacion de facturas anteriores a la ultima registrada.</li>
                            <li><strong>Nombre completo: </strong>Nombre de la persona a la cual se emite la factura</li>
                            <li><strong>DNI: </strong>Documento de la persona a la que se le emite la factura. <strong>IMPORTANTE:</strong> Solo esta permitido el uso de documentos, no cuits</li>
                            <li><strong>Dirección: </strong>Dirección de la persona a la que se le emite la factura</li>
                            <li><strong>Descripción: </strong>Descripción de la factura</li>
                            <li><strong>Unidades: </strong>Cantidad de unidades vendidas</li>
                            <li><strong>Unitario: </strong>Precio unitario de los productos</li>
                            <li><strong>Total: </strong>Multiplicación entre precio unitario y cantidad de unidades</li>
                        </ul>
                    </div>
                    </Panel>
                    <Panel header="¿Como cargar el balance anual de un cuit?" key="5">
                    <div>
                        En la pagina principal, una vez seleccionado el cuit de facturacion, se podra ver dos recuadros en la parte superior de la tabla. El de la izquierda indica si el usuario esta autenticado, el de la derecha indica el balance de la cuenta. AFIP no da la información de la facturación previa de manera automatica por lo que si se desea se puede cargar manualmente.
                        Para ello, haremos click en el ícono "+" y descargaremos el excel que utilizaremos de plantilla. En este rellenaremos los siguientes datos:
                        <ul>
                            <li><strong>Fecha:</strong>Indicar la fecha de la factura. </li>
                            <li><strong>Importe:</strong>Cantidad facturada en la fecha indicada</li>
                        </ul>
                    </div>
                    </Panel>
                    <Panel header="¿A que se debe el error fecha incorrecta durante la creacion de facturas?" key="6">
                    <div>
                        AFIP no permite la facturación en fechas anteriores a la ultima factura creada por lo que, por ejemplo, si se ha creado una factura con fecha del día 21 de enero de 2023, todas las facturas siguientes deben ser de esa fecha o posteriores.
                    </div>
                    </Panel>
                </Collapse>
            </div>
        </div>
    )
}


export default Instructions