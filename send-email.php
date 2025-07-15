<?php
// Archivo para enviar emails desde el formulario de contacto
// Este archivo debe estar en un servidor con PHP habilitado

// Configuración
$to_email = 'ale21rock@gmail.com';
$subject_prefix = '[Blog Ale Gallo] ';

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Obtener datos del formulario
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validar campos obligatorios
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Todos los campos son obligatorios']);
    exit;
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido']);
    exit;
}

// Preparar email
$subject = $subject_prefix . "Nuevo mensaje de " . $name;
$email_body = "Has recibido un nuevo mensaje desde tu blog:\n\n";
$email_body .= "Nombre: " . $name . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Mensaje:\n" . $message . "\n\n";
$email_body .= "---\n";
$email_body .= "Enviado el: " . date('d/m/Y H:i:s') . "\n";
$email_body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Headers del email
$headers = "From: " . $name . " <" . $email . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Enviar email
if (mail($to_email, $subject, $email_body, $headers)) {
    http_response_code(200);
    echo json_encode(['success' => 'Mensaje enviado correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al enviar el mensaje']);
}
?>
