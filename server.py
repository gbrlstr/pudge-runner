#!/usr/bin/env python3
"""
Servidor HTTP simples para desenvolvimento
Execute: python3 server.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Adicionar headers CORS para desenvolvimento
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def main():
    # Mudar para o diretório do script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"🎮 Pudge Runner - Servidor de Desenvolvimento")
    print(f"📂 Diretório: {os.getcwd()}")
    print(f"🌐 Porta: {PORT}")
    print(f"🔗 URL: http://localhost:{PORT}")
    print("─" * 50)
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"✅ Servidor rodando em http://localhost:{PORT}")
            print("🔥 Pressione Ctrl+C para parar")
            print("📱 Abrindo navegador...")
            
            # Abrir navegador automaticamente
            webbrowser.open(f'http://localhost:{PORT}')
            
            # Servir para sempre
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Servidor parado pelo usuário")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Porta {PORT} já está em uso!")
            print(f"💡 Tente: python3 server.py --port 8001")
        else:
            print(f"❌ Erro ao iniciar servidor: {e}")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")

if __name__ == "__main__":
    # Verificar argumentos para porta personalizada
    if len(sys.argv) > 1 and sys.argv[1] == "--port" and len(sys.argv) > 2:
        try:
            PORT = int(sys.argv[2])
        except ValueError:
            print("❌ Porta inválida! Usando porta padrão 8000")
    
    main()
