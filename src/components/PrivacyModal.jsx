import { useState } from "react";

export default function PrivacyModal({ onAccept }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-lg overflow-hidden">
        <h2 className="text-xl font-bold mb-4">Aviso de Privacidad Integral</h2>
        <div className="overflow-y-auto max-h-96 text-sm pr-2 space-y-4">
          <p>
            <strong>Sistema POS FastFood Mall</strong>  
            <br />
            Operado por <strong>FANMAF</strong>  
            <br />
            Responsable: <strong>María Fernanda Mendoza Ayala</strong>
          </p>

          <p>
            <strong>1. Identidad y domicilio del responsable del tratamiento de los datos personales</strong><br />
            El presente Aviso de Privacidad corresponde a <strong>FANMAF</strong>, empresa responsable del desarrollo y operación del sistema <strong>POS FastFood Mall</strong>, con domicilio en AV. Reforma Sur #2 Col.Centro Tehuacán, Puebla, México. Puedes contactarnos al correo electrónico: <strong>fanmafgirlsdevelopers@gmail.com</strong>.
          </p>

          <p>
            <strong>2. Finalidades del tratamiento de los datos personales</strong><br />
            Los datos personales que recabamos serán utilizados para las siguientes finalidades primarias:
            <ul className="list-disc ml-5">
              <li>Registrar y crear cuentas para restaurantes dentro del sistema POS.</li>
              <li>Proporcionar acceso a funcionalidades como toma de pedidos, sistema de cocina (KDS), reportes y analytics.</li>
              <li>Administrar información comercial, operativa y fiscal del restaurante.</li>
              <li>Emitir facturación, generar reportes y realizar seguimiento administrativo.</li>
              <li>Ofrecer soporte técnico y atención al cliente.</li>
              <li>Cumplir con obligaciones legales, fiscales y contractuales.</li>
            </ul>
            Finalidades secundarias (opcionales):
            <ul className="list-disc ml-5">
              <li>Enviar notificaciones sobre mejoras del sistema.</li>
              <li>Ofrecer promociones, servicios adicionales o encuestas.</li>
              <li>Generar estadísticas de uso para fines internos.</li>
            </ul>
            Puedes excluirte de estas finalidades secundarias enviando un correo a: <strong>fanmafgirlsdevelopers@gmail.com</strong>.
          </p>

          <p>
            <strong>3. Datos personales que recabamos</strong><br />
            - Nombre del restaurante<br />
            - Representante legal<br />
            - Dirección<br />
            - Teléfono y correo electrónico<br />
            - RFC y datos fiscales<br />
            - Usuario y contraseña<br />
            - Configuración operativa del sistema
          </p>

          <p>
            <strong>4. Transferencias de datos</strong><br />
            Tus datos no serán compartidos con terceros sin tu consentimiento, salvo en:
            <ul className="list-disc ml-5">
              <li>Requerimientos legales o fiscales.</li>
              <li>Auditorías o procesos normativos.</li>
            </ul>
          </p>

          <p>
            <strong>5. Medidas de seguridad</strong><br />
            FANMAF aplica medidas técnicas y administrativas razonables para proteger tus datos. Toda la información viaja cifrada y está protegida por autenticación.
          </p>

          <p>
            <strong>6. Derechos ARCO</strong><br />
            Puedes acceder, rectificar, cancelar u oponerte al uso de tus datos escribiendo a: <strong>[tu correo]</strong>. Deberás incluir tu nombre completo, identificación oficial y descripción clara de tu solicitud.
          </p>

          <p>
            <strong>7. Cambios al aviso de privacidad</strong><br />
            Este aviso puede modificarse. Las actualizaciones estarán disponibles en:
            <a
              href="https://www.fanmaf.com/aviso-de-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              www.fanmaf.com/aviso-de-privacidad
            </a>
          </p>

          <p>
            <strong>8. Consentimiento</strong><br />
            Al continuar con el registro, declaras haber leído y aceptado este Aviso de Privacidad, y otorgas tu consentimiento para el tratamiento de tus datos conforme a los términos establecidos.
          </p>
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="acceptPrivacy"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="acceptPrivacy">Acepto el Aviso de Privacidad</label>
        </div>

        <div className="mt-6 flex justify-center">

          <button
            onClick={() => accepted && onAccept()}
            disabled={!accepted}
            className={`px-4 py-2 rounded ${
              accepted ? "bg-blue-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
