export class AdminCreatedTemplate {
  static generate(name: string, password: string): string {
    return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bienvenido al Panel Administrativo</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f7f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #16a085 0%, #2c3e50 100%); padding: 35px 30px; text-align: center;">
                        <div style="background-color: #ffffff; width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.3px;">Panel Administrativo</h1>
                        <p style="color: rgba(255, 255, 255, 0.9); margin: 6px 0 0; font-size: 15px; font-weight: 400;">Jardín Digital</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h2 style="color: #2d3748; margin: 0 0 12px; font-size: 22px; font-weight: 600;">¡Bienvenido, ${name}!</h2>
                            <p style="color: #718096; margin: 0; font-size: 15px; line-height: 1.5;">
                                Se ha creado exitosamente tu cuenta de administrador.<br>
                                A continuación encontrarás tus credenciales de acceso.
                            </p>
                        </div>
                        
                        <!-- Credentials Box -->
                        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 28px; margin: 30px 0; text-align: center;">
                            <div style="margin-bottom: 20px;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 8px;">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <circle cx="12" cy="16" r="1"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <p style="color: #4a5568; margin: 0; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                                    Credenciales de Acceso
                                </p>
                            </div>
                            
                            <div style="background-color: #ffffff; border-radius: 6px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 16px;">
                                <p style="color: #2d3748; margin: 0 0 4px; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Contraseña Temporal</p>
                                <p style="color: #1a202c; margin: 0; font-size: 18px; font-weight: 600; font-family: 'Courier New', monospace; letter-spacing: 1px; word-break: break-all;">
                                    ${password}
                                </p>
                            </div>
                            
                            <p style="color: #718096; margin: 0; font-size: 13px; line-height: 1.4;">
                                <strong>Recomendación:</strong> Cambia tu contraseña después del primer acceso.
                            </p>
                        </div>
                        
                        <!-- Instructions -->
                        <div style="background-color: #edf2f7; border-left: 3px solid #16a085; padding: 16px 20px; border-radius: 0 6px 6px 0; margin: 25px 0;">
                            <p style="color: #2d3748; margin: 0; font-size: 14px; line-height: 1.5;">
                                <strong>Próximos pasos:</strong><br>
                                1. Inicia sesión con tus credenciales<br>
                                2. Actualiza tu contraseña por seguridad<br>
                                3. Explora las funcionalidades del panel
                            </p>
                        </div>
                        
                        <!-- Security Notice -->
                        <div style="text-align: center; margin-top: 35px;">
                            <p style="color: #a0aec0; font-size: 13px; line-height: 1.4; margin: 0;">
                                Si no esperabas este correo, contacta al administrador del sistema.<br>
                                Mantén estas credenciales seguras y privadas.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <div style="margin-bottom: 16px;">
                            <p style="color: #718096; font-size: 13px; margin: 0 0 6px; font-weight: 500;">
                                ¿Necesitas soporte técnico?
                            </p>
                            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                                Contáctanos en <a href="mailto:admin@jardindigital.com" style="color: #16a085; text-decoration: none;">admin@jardindigital.com</a>
                            </p>
                        </div>
                        
                        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
                            <p style="color: #a0aec0; font-size: 11px; margin: 0;">
                                © ${new Date().getFullYear()} Jardín Digital. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                    
                </div>
                
                <!-- Responsive styles -->
                <style>
                    @media only screen and (max-width: 600px) {
                        .container {
                            margin: 10px !important;
                        }
                        .header {
                            padding: 25px 20px !important;
                        }
                        .content {
                            padding: 30px 20px !important;
                        }
                        .credentials-box {
                            padding: 20px !important;
                        }
                    }
                </style>
            </body>
            </html>
        `;
  }
}