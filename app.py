from flask import Flask, render_template, request, send_file
import qrcode
import qrcode.image.svg
import os
import re
from urllib.parse import urlparse

app = Flask(__name__)

QR_FOLDER = "static/generated"

if not os.path.exists(QR_FOLDER):
    os.makedirs(QR_FOLDER)


@app.route("/", methods=["GET", "POST"])
def home():

    qr_path = None
    error = None

    if request.method == "POST":

        qr_type = request.form.get("type")
        data = request.form.get("data", "").strip()

        size = int(request.form.get("size", 10))
        fill = request.form.get("fill", "#000000")
        back = request.form.get("back", "#ffffff")

        # ---------------- URL ----------------

        if qr_type == "url":

            result = urlparse(data)

            if result.scheme not in ["http", "https"] or not result.netloc:
                error = "Please enter a valid URL. Example: https://google.com"

        # ---------------- EMAIL ----------------

        elif qr_type == "email":

            email = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"

            if not re.fullmatch(email, data):
                error = "Please enter a valid Email."

        # ---------------- PHONE ----------------

        elif qr_type == "phone":

            if not re.fullmatch(r"\d{10}", data):
                error = "Please enter a valid 10-digit Mobile Number."

        # ---------------- TEXT ----------------

        elif qr_type == "text":

            if len(data) == 0:
                error = "Please enter some text."

        # ---------------- WIFI ----------------

        elif qr_type == "wifi":

            if len(data) == 0:
                error = "Please enter Wi-Fi Name."

            else:

                data = f"WIFI:T:WPA;S:{data};P:12345678;;"

        # ---------------- QR Generate ----------------

        if error is None:

            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=size,
                border=4,
            )

            qr.add_data(data)

            qr.make(fit=True)

            img = qr.make_image(
                fill_color=fill,
                back_color=back,
            )

            png_path = os.path.join(QR_FOLDER, "qr.png")

            img.save(png_path)

            # SVG

            factory = qrcode.image.svg.SvgImage

            svg = qrcode.make(
                data,
                image_factory=factory,
            )

            svg_path = os.path.join(QR_FOLDER, "qr.svg")

            svg.save(svg_path)

            qr_path = "/" + png_path.replace("\\", "/")

    return render_template(
        "index.html",
        qr=qr_path,
        error=error,
    )


# ---------------- DOWNLOAD PNG ----------------


@app.route("/download")
def download():

    file = os.path.join(QR_FOLDER, "qr.png")

    if os.path.exists(file):

        return send_file(
            file,
            as_attachment=True,
            download_name="qr.png",
        )

    return "No QR Generated"


# ---------------- DOWNLOAD SVG ----------------


@app.route("/download_svg")
def download_svg():

    file = os.path.join(QR_FOLDER, "qr.svg")

    if os.path.exists(file):

        return send_file(
            file,
            as_attachment=True,
            download_name="qr.svg",
        )

    return "No SVG Generated"


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
    )
