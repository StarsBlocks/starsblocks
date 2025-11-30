export const metadata = {
  title: 'Términos y Condiciones · StarBlocks',
  description: 'Información legal y condiciones generales de uso de la plataforma StarBlocks.',
}

const sections: { title: string; content: string[] }[] = [
  {
    title: 'Información legal',
    content: [
      'STARBLOCKS (en adelante: “StarBlocks”), con domicilio en Calle Fray Luis de León 11, 28012, Madrid, ESPAÑA y con N.I.F. ………………., inscrita en el Registro Mercantil de Madrid, al tomo ………….., folio ……….., Inscripción … con Hoja …-…………….., es titular de la página web https://starblocks.com/ y de la wallet mediante la cual se accede a las aplicaciones y servicios de StarBlocks.',
      'Las presentes condiciones generales, el Aviso Legal, la Política de Privacidad, la Política de Cookies y cualesquiera otras condiciones específicas publicadas en la presente web son aplicables a toda persona con capacidad legal que contrate los servicios de StarBlocks a través de la web, la app (iOS/Android) o la plataforma de seguimiento de reciclaje para la gestión del correspondiente programa de incentivos (“Plataforma”).',
      'STARBLOCKS es responsable de la web https://starblocks.com, de la Plataforma y de la APP, así como de su contenido. Su actividad principal consiste en proporcionar distintos servicios vinculados al reciclaje de residuos y la gestión de programas de incentivos (“Servicios”).',
      'Las presentes condiciones se entenderán aceptadas por la entidad pública contratante con la adjudicación de la licitación que habilita el uso de la Plataforma en los términos acordados.',
    ],
  },
  {
    title: 'Usuarios institucionales y usuarios',
    content: [
      'Los empleados y responsables de las entidades públicas que accedan a la Plataforma deberán ser mayores de edad, con capacidad legal y debidamente acreditados para aceptar las presentes condiciones y operar en representación de la entidad adjudicadora como “Usuario Institucional”.',
      'Podrán adquirir la condición de Usuario las personas mayores de edad y con capacidad para contratar que acepten las presentes condiciones. En caso de actuar en nombre de una persona jurídica, deberán contar con poderes suficientes.',
      'Todo Usuario se responsabiliza del uso y custodia de sus credenciales. StarBlocks podrá bloquear accesos cuando lo estime necesario por motivos de seguridad.',
      'El registro como Usuario Institucional o Usuario implica la aceptación íntegra de las condiciones, Aviso Legal y Política de Privacidad.',
    ],
  },
  {
    title: 'Servicios y obligaciones',
    content: [
      'Los servicios actuales prestados a través de la Plataforma no se encuentran regulados ni supervisados, pero StarBlocks es responsable de su correcta prestación. Cualquier uso fraudulento o ilegal será investigado y, en su caso, denunciado.',
      'Los Servicios se consideran aceptados cuando la licitación haya sido adjudicada y comunicada a StarBlocks en el caso de Usuarios Institucionales, o cuando el Usuario haya completado el registro. StarBlocks confirmará la entrada en vigor en un máximo de veinticuatro horas.',
      'StarBlocks puede modificar estas condiciones en cualquier momento para adaptarlas a la normativa vigente. Los cambios relevantes se notificarán con una antelación mínima de treinta días naturales.',
      'El uso de la Plataforma por menores de dieciocho años está prohibido. Excepcionalmente, los Usuarios Institucionales podrán acreditar delegaciones específicas para mayores de dieciséis años en los términos legales.',
    ],
  },
  {
    title: 'Información y documentación',
    content: [
      'Determinados servicios de libre acceso pueden utilizarse sin aceptación expresa de estas condiciones, conforme a lo indicado en el Aviso Legal.',
      'La duración de las presentes condiciones para los Usuarios Institucionales será igual a la licitación adjudicada, prorrogándose automáticamente salvo notificación en contrario. Para los Usuarios individuales la duración inicial será de un año, con prórrogas sucesivas.',
    ],
  },
  {
    title: 'Servicios específicos',
    content: [
      'StarBlocks NFC es un dispositivo asociado a la wallet pública del usuario que permite registrar intercambios de residuos mediante tecnología NFC. Su uso implica aceptar los términos específicos del soporte físico.',
      'StarBlocks Account ofrece informes sobre beneficios o pérdidas derivados del reciclaje. Los informes son orientativos y el Usuario es responsable último de sus obligaciones fiscales.',
      'StarBlocks podrá imponer límites o rechazar transacciones para cumplir con la normativa y políticas internas.',
    ],
  },
  {
    title: 'Propiedad intelectual e industrial',
    content: [
      'La web, el software y la wallet de StarBlocks, así como su código fuente y contenidos, están protegidos por normas nacionales e internacionales de propiedad intelectual e industrial.',
      'El acceso no otorga ningún derecho sobre dichos elementos. Queda prohibida la reproducción, distribución o modificación sin autorización expresa.',
    ],
  },
  {
    title: 'Información adicional y soporte',
    content: [
      'StarBlocks pone a disposición una Base de Conocimiento accesible en https://support.starblocks.com/ con documentación sobre procesos de registro, reciclaje y funcionalidades de la plataforma.',
      'El servicio de atención al Usuario está disponible en https://starblocks.com/support.',
    ],
  },
  {
    title: 'Obligaciones y responsabilidades',
    content: [
      'StarBlocks garantizará la disponibilidad del servicio salvo interrupciones por mantenimiento, incidencias técnicas o fuerza mayor.',
      'Los Usuarios son responsables de la información proporcionada, del uso de sus credenciales y de mantenerlas confidenciales.',
      'StarBlocks podrá suspender temporalmente el servicio ante incumplimientos, falta de documentación o por motivos de seguridad.',
      'Una cuenta puede declararse inactiva tras 12 meses sin transacciones o 3 meses sin inicio de sesión.',
    ],
  },
  {
    title: 'Extinción del contrato',
    content: [
      'Las presentes condiciones se extinguirán por falta de aceptación de actualizaciones, resolución unilateral por incumplimiento, deseo expreso del Usuario o por finalización de la licitación adjudicada.',
      'Las acciones fraudulentas, el suministro de información falsa o la participación en actividades ilegales habilitarán a StarBlocks a cancelar los servicios.',
    ],
  },
  {
    title: 'Protección de datos',
    content: [
      'Los servicios requieren el tratamiento de datos personales. La Política de Privacidad debe aceptarse junto con estas condiciones.',
      'Los datos se tratan conforme a la legislación vigente y solo para la prestación de los servicios descritos.',
    ],
  },
  {
    title: 'Ley aplicable',
    content: [
      'Las presentes condiciones se rigen por la legislación del Reino de España. Para la resolución de controversias, las partes se someten a los juzgados y tribunales de la Villa de Madrid, salvo que la normativa aplicable disponga otra cosa.',
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="legal-shell">
      <header className="legal-hero">
        <p className="legal-hero__eyebrow">Documento Legal</p>
        <h1>Términos y Condiciones de StarBlocks</h1>
        <p>
          Este documento resume las condiciones generales, obligaciones y responsabilidades aplicables a la
          utilización de la Plataforma StarBlocks por parte de entidades públicas y usuarios particulares.
        </p>
      </header>

      <div className="legal-content">
        {sections.map((section) => (
          <section key={section.title} className="legal-section">
            <h2>{section.title}</h2>
            {section.content.map((paragraph, index) => (
              <p key={`${section.title}-${index}`}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </main>
  )
}
