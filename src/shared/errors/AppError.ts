// Erreur personnalisée utilisée dans l'application
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}
