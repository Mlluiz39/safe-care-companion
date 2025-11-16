// WellnessBanner.tsx
export function WellnessBanner() {
  return (
    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden p-4 sm:p-8 mb-4 sm:mb-8 shadow-xl">
      {/* Gradiente */}
      <div className="absolute inset-0 bg-[var(--gradient-wellness)]"></div>

      {/* Overlay escuro para garantir contraste */}
      <div className="absolute inset-0 bg-black/25 dark:bg-black/40 backdrop-blur-sm"></div>

      {/* Conteúdo */}
      <div className="relative z-10">
        <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white">
          Bem-vindo de volta!
        </h2>
        <p className="text-sm sm:text-base text-white/90">
          Gerencie a saúde da sua família de forma simples e organizada
        </p>
      </div>

      {/* brilho decorativo */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
    </div>
  )
}
