// Config.jsx
import React from "react";
import {
  MdPerson,
  MdNotifications,
  MdDarkMode,
  MdHome,
  MdSecurity,
  MdDevices,
  MdLock,
  MdHelpOutline,
  MdEmail,
  MdWhatsapp,
  MdQuestionAnswer,
  MdLogout,
} from "react-icons/md";

import BloqueCardConfig from "./BloqueCardConfig";
import BloqueRowConfig from "./BloqueRowConfig";
import ResetAppConfigSection from "./ResetAppConfigSection";

const Config = () => {
  return (
    <section className="p-4 pb-24 flex flex-col gap-4">
      {/* Header */}
      <header className="mb-2">
        <h1 className="text-xl font-semibold">Configuración</h1>
      </header>

      {/* 1) General Settings */}
      <BloqueCardConfig titulo="General Settings" defaultAbierto={false}>
        {/* Perfil */}
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 text-sm font-semibold">
            DZ
          </div>
          <div>
            <p className="text-sm font-medium">Darío Zalovich</p>
            <p className="text-xs text-gray-500">Editar el perfil</p>
          </div>
        </div>

        <BloqueRowConfig
          icon={MdPerson}
          titulo="Account Settings"
          subtitulo="Información de cuenta"
        />

        <BloqueRowConfig
          icon={MdNotifications}
          titulo="Notificaciones"
          tieneToggle
        />

        <BloqueRowConfig
          icon={MdDarkMode}
          titulo="Dark Mode"
          tieneToggle
        />

        <BloqueRowConfig
          icon={MdHome}
          titulo="Direcciones"
          subtitulo="Direcciones guardadas"
        />
      </BloqueCardConfig>

      {/* 2) Seguridad */}
      <BloqueCardConfig titulo="Seguridad" defaultAbierto={false}>
        <BloqueRowConfig
          icon={MdLock}
          titulo="Cambiar contraseña"
          subtitulo="Actualizar contraseña de acceso"
        />
        <BloqueRowConfig
          icon={MdDevices}
          titulo="Dispositivos vinculados"
          subtitulo="Ver dispositivos con sesión iniciada"
        />
        <BloqueRowConfig
          icon={MdSecurity}
          titulo="Autenticación en dos pasos"
          subtitulo="Decorativo"
          tieneToggle
        />
      </BloqueCardConfig>

      {/* 3) Contactarnos */}
      <BloqueCardConfig titulo="Contactarnos" defaultAbierto={false}>
        <BloqueRowConfig
          icon={MdEmail}
          titulo="Enviar correo"
          subtitulo="soporte@despertador.app"
        />
        <BloqueRowConfig
          icon={MdWhatsapp}
          titulo="WhatsApp"
          subtitulo="+598 0000 0000"
        />
        <BloqueRowConfig
          icon={MdQuestionAnswer}
          titulo="Preguntas frecuentes"
          subtitulo="Ver ayuda y tutoriales"
        />
      </BloqueCardConfig>

      {/* 4) Log Out */}
      <BloqueCardConfig titulo="Log Out" defaultAbierto={false}>
        <BloqueRowConfig
          icon={MdLogout}
          titulo="Cerrar sesión"
          subtitulo="Vuelve más tarde"
        />
        <BloqueRowConfig
          icon={MdLogout}
          titulo="Eliminar cuenta"
          subtitulo=":("
        />
      </BloqueCardConfig>

      {/* 5) Resetear aplicación */}
      <ResetAppConfigSection />
    </section>
  );
};

export default Config;
