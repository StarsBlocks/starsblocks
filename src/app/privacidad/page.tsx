export const metadata = {
  title: 'Política de Privacidad · StarBlocks',
  description: 'Información sobre protección de datos y tratamiento de la información personal en StarBlocks.',
}

const sections: { title: string; content: string[] }[] = [
  {
    title: 'Información general',
    content: [
      'En cumplimiento del Reglamento (UE) 2016/679 (RGPD), de la Ley Orgánica 3/2018 (LOPDGDD) y demás normativa aplicable, los datos personales facilitados serán incorporados a una base de datos titularidad de StarBlocks. Los datos solicitados son los estrictamente necesarios para la prestación de los servicios. La negativa a proporcionar los datos obligatorios impedirá el acceso al servicio.',
      'En caso de facilitar datos de terceros, el Interesado se compromete a informarles del contenido de esta política. StarBlocks recuerda que no deben subirse imágenes o información personal sin los permisos necesarios; el usuario es responsable de la información que comparte en su perfil.',
      'El Interesado se compromete a comunicar a StarBlocks cualquier modificación o rectificación de sus datos para mantenerlos actualizados.',
    ],
  },
  {
    title: 'Responsable del tratamiento',
    content: [
      'Denominación social: STARBLOCKS',
      'CIF: ………………………………..',
      'Dirección: Calle de Fray Luis de León n.º 11, Madrid, ESPAÑA',
      'Correo electrónico: rgpd@starblocks.com',
      'Delegado de protección de datos: dpd@starblocks.com',
    ],
  },
  {
    title: 'Datos personales que podemos recabar y finalidades',
    content: [
      'Contacto comercial: nombre, teléfono, email y consulta. Finalidad: responder solicitudes de información y mantener relaciones comerciales. Legitimación: consentimiento e interés legítimo. Conservación: hasta que el interesado solicite la supresión y, posteriormente, durante los plazos legales.',
      'Currículum Vitae: datos profesionales proporcionados por el candidato. Finalidad: gestionar procesos de selección. Legitimación: consentimiento o medidas precontractuales. Conservación: hasta adjudicación del puesto o solicitud de supresión.',
      'Información comercial y promociones: datos de contacto y metadatos de navegación. Finalidad: remisión de novedades y promociones. Legitimación: consentimiento e interés legítimo. Conservación: hasta baja del servicio y plazos legales posteriores.',
      'Prestación de servicios: nombre, apellidos, DNI, contacto y otros datos necesarios para el registro y uso de la plataforma. Finalidad: gestionar el registro y la relación contractual. Legitimación: relación contractual e interés legítimo.',
      'Redes sociales: datos facilitados al seguir cuentas oficiales (ej. Telegram). Finalidad: comunicación orgánica o promocional. Legitimación: consentimiento e interés legítimo.',
      'Clientes/Proveedores: datos profesionales para gestionar la relación contractual. Legitimación: relación contractual e interés legítimo.',
      'Videovigilancia/control de accesos: imágenes y datos identificativos. Finalidad: seguridad interna. Legitimación: interés legítimo. Conservación: máximo 30 días salvo requerimientos legales.',
      'Eventos: datos identificativos, imagen o avatar. Finalidad: gestionar eventos y difusión. Legitimación: consentimiento. Conservación: plazo necesario y plazos legales posteriores.',
      'Mejora de experiencia: IP, hora de conexión e ID seudónimos. Finalidad: análisis y resolución de incidencias. Legitimación: interés legítimo y consentimiento para casos específicos.',
      'Canal de informantes: datos identificativos (o denuncia anónima) y descripción de hechos. Finalidad: gestión del canal de denuncias. Legitimación: obligación legal (Ley 2/2023). Conservación: hasta 3 meses, ampliable otros 3 en casos complejos.',
    ],
  },
  {
    title: 'Destinatarios y cesiones',
    content: [
      'Los datos podrán ser cedidos a terceros cuando sea necesario para cumplir obligaciones legales o para la prestación de servicios por parte de encargados de tratamiento que cumplan las garantías del RGPD.',
      'En los procesos de selección, los datos podrán compartirse con empresas identificadas por el candidato para solicitar referencias.',
      'Para eventos y acciones de difusión, se podrán publicar imágenes y datos autorizados en medios externos o redes sociales con la finalidad descrita.',
      'StarBlocks podrá comunicar datos a autoridades competentes o a terceros para prevenir fraudes, garantizar seguridad o cumplir con la legislación vigente.',
    ],
  },
  {
    title: 'Interés legítimo y derechos',
    content: [
      'Determinados tratamientos se basan en el interés legítimo de StarBlocks tras una ponderación de derechos. Ejemplos: prevención de fraude, mantenimiento de relaciones comerciales, mejora de experiencia de usuario y seguridad física en instalaciones.',
      'El Interesado puede solicitar el análisis de ponderación enviando un correo a dpd@starblocks.com y tiene derecho a oponerse a los tratamientos basados en interés legítimo.',
      'Derechos del Interesado: acceso, rectificación, supresión, limitación, oposición, portabilidad y retirada del consentimiento. Para ejercerlos, puede enviar una comunicación con su identificación a rgpd@starblocks.com.',
    ],
  },
  {
    title: 'Medidas de seguridad',
    content: [
      'StarBlocks adopta medidas técnicas y organizativas para proteger los datos frente a accesos no autorizados, alteración o pérdida.',
      'Las cuentas y claves de acceso son responsabilidad del usuario, quien debe mantenerlas en secreto y comunicar cualquier incidente.',
      'StarBlocks podrá bloquear el acceso cuando detecte usos irregulares, sospechas de fraude o riesgos para la seguridad.',
    ],
  },
  {
    title: 'Conservación y duración',
    content: [
      'Los datos se conservarán durante el tiempo necesario para cumplir la finalidad del tratamiento y, posteriormente, durante los plazos legales exigidos para atender obligaciones administrativas, judiciales o regulatorias.',
      'Las cuentas inactivas pueden cerrarse tras periodos de inactividad prolongada según lo previsto en los términos y condiciones.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="legal-shell">
      <header className="legal-hero">
        <p className="legal-hero__eyebrow">Protección de Datos</p>
        <h1>Política de Privacidad de StarBlocks</h1>
        <p>
          Esta política detalla cómo StarBlocks trata los datos personales de Usuarios Institucionales y Usuarios
          privados, las finalidades de tratamiento, la base jurídica y los derechos que asisten a los interesados.
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
