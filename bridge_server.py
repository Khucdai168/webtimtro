import socket
import serial
import serial.tools.list_ports
import threading
import time

# =====================================================
# CONFIG
# =====================================================

HOST = "0.0.0.0"
PORT = 5000
BAUD = 115200


# =====================================================
# TIM CONG ESP32
# =====================================================

def find_esp32_port():

    ports = serial.tools.list_ports.comports()

    for p in ports:

        desc = p.description.upper()

        if (
            "CP210" in desc
            or "CH340" in desc
            or "CH341" in desc
            or "UART" in desc
            or "USB" in desc
        ):
            print(f"[AUTO DETECT] Tim thay ESP32 tai: {p.device} ({p.description})")
            return p.device

    return None


# =====================================================
# XU LY CLIENT
# =====================================================

def handle_client(conn, addr, ser):

    print(f"[CONNECTED] {addr}")

    buf = ""

    try:

        while True:

            data = conn.recv(1024).decode("utf-8", errors="ignore")

            if not data:
                break

            buf += data

            while "\n" in buf:

                line, buf = buf.split("\n", 1)

                line = line.strip()

                if line:

                    print(f"  PC -> ESP32 : {line}")

                    try:

                        ser.write((line + "\n").encode())

                    except Exception as e:

                        print(f"  [SERIAL ERROR] {e}")

    except Exception as e:

        print(f"[CLIENT ERROR] {e}")

    finally:

        conn.close()

        print(f"[DISCONNECTED] {addr}")


# =====================================================
# MAIN
# =====================================================

def main():

    # Tìm cổng serial
    port = find_esp32_port()

    if port is None:

        port = "/dev/ttyUSB0"

        print(f"[FALLBACK] Dung cong mac dinh: {port}")

    print(f"[SERIAL] Ket noi ESP32 tai {port} ({BAUD} baud)...")

    try:

        ser = serial.Serial(port, BAUD, timeout=1)

        time.sleep(2)

        print("[SERIAL] OK")

    except Exception as e:

        print(f"[SERIAL FAILED] {e}")
        print("Kiem tra lai cong USB va thu lai.")
        return

    # Mo TCP server
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    server.bind((HOST, PORT))

    server.listen(5)

    print(f"[SERVER] Lang nghe tai port {PORT}")
    print(f"[SERVER] Nhap IP nay vao phan mem tren PC:")

    import subprocess

    try:

        ip = subprocess.check_output(
            ["hostname", "-I"]
        ).decode().strip().split()[0]

        print(f"  --> IP: {ip}")

    except:

        print("  --> Chay 'hostname -I' de xem IP")

    print("[SERVER] San sang nhan lenh...\n")

    # Vong lap chap nhan ket noi
    while True:

        try:

            conn, addr = server.accept()

            t = threading.Thread(
                target=handle_client,
                args=(conn, addr, ser),
                daemon=True
            )

            t.start()

        except KeyboardInterrupt:

            print("\n[SHUTDOWN]")

            break

        except Exception as e:

            print(f"[ACCEPT ERROR] {e}")

    server.close()

    ser.close()


if __name__ == "__main__":
    main()
