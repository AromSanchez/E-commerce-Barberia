import Main from "../Main/Main";
import CardProduct from "./CardProduct";
const MainHome = () => {

  return (
    <Main>
      {/* Sección de presentación DENTRO de Main */}
      <div
        className="
          flex 
          flex-wrap
          justify-between 
          items-center  {/* Centra verticalmente el contenido izquierdo y el bloque de imagen derecho */}
          px-40         {/* Padding horizontal para la sección */}
          h-[656px]     {/* Altura fija para la sección de presentación */}
          bg-[linear-gradient(91deg,_#1A0B01_0.64%,_#211C24_101%)]
          text-white
        "
      >
        {/* --- Contenido de la Izquierda --- */}
        <div 
          className="
            flex 
            flex-col
            items-start
            gap-6
            min-w-[400px]
            flex-1 {/* El contenido izquierdo toma espacio flexible */}
          "
        >
          {/* Contenedor de los Títulos */}
          <div className="flex flex-col items-start gap-6 self-stretch">
            <h2 className="self-stretch font-inter text-[25px] font-semibold leading-[32px] opacity-40 text-white">
              Para tu elegancia
            </h2>
            <h1 className="self-stretch font-inter text-[96px] font-semibold leading-[72px] tracking-[-0.96px] text-white">
              Kit Barber Pro
            </h1>
          </div>
          {/* Párrafo Descriptivo */}
          <p className="self-stretch text-[#909090] font-inter text-lg font-medium leading-6">
            Creado para el mejor cuidado para todos.
          </p>
          {/* Botón "Compra ahora" */}
          <button
            type="button"
            className="
              flex py-4 px-14 justify-center items-center gap-2 rounded-md
              border border-white text-white font-inter font-medium
              hover:bg-white hover:text-black transition-colors
            "
          >
            Compra ahora
          </button>
        </div>

        {/* --- Contenido de la Derecha (Imagen de los productos) --- */}
        <div
          className="
            w-[464px]  {/* Ancho fijo para el contenedor de la imagen */}
            h-full     {/* ESTE ES EL CAMBIO CLAVE: el contenedor toma la altura completa (656px) */}
            {/* Las siguientes clases relacionadas con el fondo del div ya no son necesarias aquí si usas <img> */}
            {/* aspect-[464/623] ya no es necesario aquí, object-cover en <img> lo maneja */}
          "
        > 
          <img 
            src='/images/imaBanner.png' // Asegúrate que esta ruta sea correcta
            alt="Kit Barber Pro Productos" // Texto alternativo más descriptivo
            className="w-full h-full object-cover" // La imagen llena su contenedor, mantiene el aspect ratio y se recorta si es necesario
          />
        </div>
      </div>
      {/* Sección 2 */}
      <div className="flex flex-row w-full justify-center"> {/* Cambiado a justify-center para eliminar espacios en medio */}
        <div className="
            flex flex-col justify-center
            w-1/2 {/* Mantiene w-1/2 para ocupar exactamente la mitad */}
            h-full 
            bg-black
            ">
          <div className=" 
              relative flex h-[328px] pl-[334px] pr-0 justify-end items-center 
              self-stretch bg-white overflow-hidden
            "
          >
            <img src="/images/maquina.png" alt="FadeMaster Pro" className="
                absolute top-0 left-1 w-[375px] h-full object-cover 
              " />
            {/* Bloque de Texto para FadeMaster Pro */}
            <div className="text-left flex-end mr-20">
              <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-3">
                Máquina de<br />
                Corte<br />
                FadeMaster<br />
                Pro
              </h2>
              <p className="text-sm text-gray-600 leading-snug">
                Motor silencioso y potente. Para cortes<br />
                precisos y profesionales.
              </p>
            </div>
          </div>
          <div className="
              flex flex-row          /* Cambiado a  directamente sin md: */
              items-start           /* align-items: flex-start; */
              self-stretch          /* align-self: stretch; */
              w-full                /* w: 100% */
              h-[272px]             /* height: 272px; (fija) */
              gap-0                 /* Sin espacio entre elementos */
              overflow-hidden       /* Evita desbordamiento */
            ">
            <div className="
                w-[279px]           /* Ancho fijo */
                h-full              /* Altura completa del padre (272px) */
              bg-[#FDF1DF]        /* Fondo */
               flex flex-row items-center justify-start 
               p-0                /* Añadido un pequeño padding general para que no esté tan pegado a los bordes */
              text-left           /* Alineación de texto a la izquierda para el texto hijo */
              flex-shrink-0       
              "
            >
            {/* Div de la imagen Shaver (a la izquierda) */}
                      <img src="/images/shaver.png" alt="Shaver Whal Finale" className="
              w-[100px]             /* Ancho ajustado de la imagen */
              h-[260px]             /* Alto ajustado de la imagen */
              object-contain        /* Para asegurar que la imagen se vea completa */
                     flex-shrink-0         /* Para que la imagen no se encoja */
                     rounded-md            /* Un ligero redondeo si se desea */
                    "/>
              {/* Div del texto Shaver (a la derecha de la imagen) */}
              <div className="ml-3 flex-1"> {/* ml-3 para espacio, flex-1 para tomar el resto del ancho */}
                <h3 className="text-xl md:text-4xl font-bold text-black leading-tight mb-2">
                 Shaver<br />
                  Whal<br />
                 Finale
                </h3>
                <p className="text-xs text-gray-600 leading-snug">
                 Afeitado al ras con<br />
                 lámina hipoalergénica.<br />
                 Ideal para acabados.
               </p>
              </div>
            </div>
            <div className="
    flex-1 self-stretch bg-[#424242] 
    w-full max-w-[485px] h-full      /* ancho y alto como especificaste */
    flex flex-row items-center       /* Para alinear imagen y texto horizontalmente y centrarlos verticalmente */
    p-6 md:p-8                       /* Un padding general para el contenido */
  "
>
  {/* Imagen de la Secadora */}
  <img
    src="/images/secadora.png"
    alt="Secadora Gamma Xcell"
    className="
      w-[140px] h-[210px]      /* Tamaño ajustado para el layout horizontal */
      md:w-[160px] md:h-[240px] 
      object-contain          /* Para asegurar que la imagen se vea completa */
      flex-shrink-0           /* Para que la imagen no se encoja */
    "
  />
  {/* Bloque de Texto para Secadora */}
  <div className="ml-4 md:ml-6 text-left flex-1"> {/* Espacio a la izq. del texto, toma el resto del ancho */}
    <h3 className="text-4xl md:text-4xl font-semibold text-white leading-tight mb-4">
      Secadora<br />
      Gamma Xcell
    </h3>
    <p className="text-sm text-gray-300 leading-snug">
      Compacta, potente y<br />
      silenciosa. Tecnología<br />
      italiana.
    </p>
  </div>
</div>
          </div>
        </div>
        
        {/* Div con fondo #DCFFFC ahora al lado derecho */}
        <div className="
            w-1/2                  
            h-[600px]              /* height: 600px; */
            bg-[#DCFFFC]           /* background: #DCFFFC; */
            relative               /* Para posicionar la imagen de la botella */
            flex                   /* display: flex; (para el contenido textual) */
            items-center           /* align-items: center; (para el contenido textual) */
            py-11                  /* padding vertical 44px */
            pl-10 md:pl-14         /* padding-left: 56px (ajustado un poco para responsividad) */
            pr-[270px]             /* padding-right: ajustado para el espacio de la imagen (calc(56px+202px+~16px)) */  
          "
        >
          <img src="/images/reuzel.png" alt="Reuzel Hair Tonic" className="
              absolute bottom-[45px] right-[100px] /* Ajustado right para más consistencia con la imagen */
              w-[180px] h-[450px] md:w-[202px] md:h-[502px] object-contain 
            " />
          
          {/* Bloque de Texto y Botón para Reuzel */}
          <div className="text-left px-20"> {/* Este bloque se centrará verticalmente y se alineará a la izquierda por las clases del padre */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-800 tracking-tight">
              Reuzel
            </h2>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black tracking-tight mb-4">
              Hair Tonic
            </h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-8">
              Tónico refrescante para peinar y <br />cuidar el cuero cabelludo.
            </p>
            <button
            type="button"
            className="
              flex py-4 px-14 justify-center items-center gap-2 rounded-md
              border border-black text-black font-inter font-medium
              hover:bg-black hover:text-white transition-colors
            "
          >
            Compra ahora
          </button>
          </div>
        </div>
      </div>
      {/* Seccion 3 */}
      <div >
        <h1>Productos Destacads</h1>
        <CardProduct />
      </div>
      {/* =========== SECCIÓN 4: CUATRO BLOQUES DE PRODUCTOS =========== */}
      <div className="w-full max-w-screen-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> {/* Usar grid-cols-2 lg:grid-cols-4 para mejor responsividad y gap en grid */}
    {/* Cuadro 1 - Productos Populares */}
    <div className="h-[664px] bg-white col-span-1 p-6 md:p-8 flex flex-col justify-between rounded-lg shadow-lg"> {/* Añadido rounded-lg y shadow-lg para consistencia visual */}
      <div>
        {/* Placeholder para imagen: Ajustado altura y margen inferior */}
        <div className="h-80 mb-6 bg-slate-200 rounded-md flex items-center justify-center">
          <span className="text-slate-500">Imagen Producto 1</span> {/* Texto placeholder mejorado */}
        </div>
        <h3 className="text-black text-4xl font-bold mb-3 leading-tight">
          Productos Populares
        </h3>
        <p className="text-gray-600 text-2x leading-relaxed">
          Las herramientas esenciales para cortes y estilos profesionales.
        </p>
      </div>
      <button
        type="button"
        className="
          w-full mt-6 flex py-3 px-6 justify-center items-center gap-2 rounded-md
          border border-black text-black 
          font-semibold text-base /* Ajustado font */
          hover:bg-black hover:text-white transition-colors
        "
      >
        Shop Now {/* Cambiado a Shop Now como en la imagen */}
      </button>
    </div>

    {/* Cuadro 2 - Kit de Cuidado para Barba */}
    <div className="h-[664px] bg-[#F9F9F9] col-span-1 p-6 md:p-8 flex flex-col justify-between rounded-lg shadow-lg">
      <div>
        <div className="h-80 mb-6 bg-slate-200 rounded-md flex items-center justify-center">
          <span className="text-slate-500">Imagen Producto 2</span>
        </div>
        <h3 className="text-black text-4xl font-bold mb-3 leading-tight">
          Kit de Cuidado para Barba
        </h3>
        <p className="text-gray-600 text-2x leading-relaxed">
          Incluye aceite y cepillo de madera. Para barbas suaves y con estilo.
        </p>
      </div>
      <button
        type="button"
        className="
          w-full mt-6 flex py-3 px-6 justify-center items-center gap-2 rounded-md
          border border-black text-black 
          font-semibold text-base
          hover:bg-black hover:text-white transition-colors
        "
      >
        Shop Now
      </button>
    </div>

    {/* Cuadro 3 - Tijeras Premium Japan Steel */}
    <div className="h-[664px] bg-[#EAEAEA] col-span-1 p-6 md:p-8 flex flex-col justify-between rounded-lg shadow-lg">
      <div>
        <div className="h-80 mb-6 bg-slate-200 rounded-md flex items-center justify-center">
          <span className="text-slate-500">Imagen Producto 3</span>
        </div>
        <h3 className="text-black text-4xl font-bold mb-3 leading-tight">
          Tijeras Premium Japan Steel
        </h3>
        <p className="text-gray-600 text-2x leading-relaxed">
          Tijeras de acero japonés, ergonómicas y afiladas para cortes profesionales.
        </p>
      </div>
      <button
        type="button"
        className="
          w-full mt-6 flex py-3 px-6 justify-center items-center gap-2 rounded-md
          border border-black text-black 
          font-semibold text-base
          hover:bg-black hover:text-white transition-colors
        "
      >
        Shop Now
      </button>
    </div>

    {/* Cuadro 4 - Silla de Barbería Classic Pro */}
    <div className="h-[664px] bg-[#625F53] col-span-1 p-6 md:p-8 flex flex-col justify-between rounded-lg shadow-lg">
      <div>
        <div className="h-80 mb-6 bg-slate-700 rounded-md flex items-center justify-center"> {/* Placeholder más oscuro para fondo oscuro */}
          <span className="text-slate-400">Imagen Producto 4</span>
        </div>
        <h3 className="text-white text-4xl font-bold mb-3 leading-tight">
          Silla de Barbería Classic Pro
        </h3>
        <p className="text-gray-300 text-2x leading-relaxed">
          Diseño vintage, reclinable, y ultra cómoda. El centro de tu barbería.
        </p>
      </div>
      {/* Botón con estilos adaptados para fondo oscuro */}
      <button
        type="button"
        className="
          w-full mt-6 flex py-3 px-6 justify-center items-center gap-2 rounded-md
          border border-white text-white /* Borde y texto blanco */
          font-semibold text-base
          hover:bg-white hover:text-[#625F53] transition-colors /* Hover invierte colores */
        "
      >
        Shop Now
      </button>
    </div>
  </div>
      </div>

      {/* =========== SECCIÓN 5:=========== */}
      <div>
        <h1>Recomendaciones</h1>
        <h2>Para ti</h2>
      </div>

      {/* =========== SECCIÓN 6:=========== */}
      <section 
  className="
    flex flex-col justify-center items-center
    gap-4
    h-[448px]
    self-stretch
    bg-gray-400
    bg-center bg-cover bg-no-repeat
    shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
    w-full max-w-screen-2xl mx-auto
    relative
  "
  style={{ 
    backgroundImage: `url('/images/Banner2.jpg')` 
  }}
>
  {/* Overlay opcional para mejorar legibilidad */}
  <div className="absolute inset-0 bg-black bg-opacity-60"></div>
  
  {/* Contenido centrado con z-index para estar sobre el overlay */}
  <div className="relative z-10 text-center max-w-2xl px-6">
    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
      Suscríbete Ahora
    </h2>
    <p className="text-lg md:text-xl text-white mb-8 font-light opacity-90">
      Y recibe un descuento por tu primera compra
    </p>
    
    {/* Formulario de suscripción */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
      <input 
        type="email" 
        placeholder="Ingresa tu email"
        className="
          px-6 py-3 
          bg-white bg-opacity-20 
          backdrop-blur-sm 
          border border-white border-opacity-30 
          rounded-full 
          text-white placeholder-white placeholder-opacity-70
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
          min-w-[300px]
        "
      />
      <button className="
        px-8 py-3 
        bg-white 
        text-gray-900 
        font-semibold 
        rounded-full 
        hover:bg-gray-100 
        transition-all duration-300 
        transform hover:scale-105
        shadow-lg
        min-w-[140px]
      ">
        Suscribirse
      </button>
    </div>
    
    {/* Texto adicional */}
    <p className="text-sm text-white opacity-75">
      *Descuento válido solo para nuevos suscriptores
    </p>
  </div>
      </section>
    </Main>
  );
};

export default MainHome;