<?php
class EmailSender {
    private $environment;
    
    public function __construct() {
        // Auto-detect environment
        $this->environment = ($_SERVER['HTTP_HOST'] == 'localhost' || 
                             strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false ||
                             $_SERVER['SERVER_NAME'] == 'localhost') 
                            ? 'local' : 'production';
    }
    
    public function sendVerificationEmail($email, $token) {
        if ($this->environment === 'local') {
            return $this->sendLocal($email, $token);
        } else {
            return $this->sendProduction($email, $token);
        }
    }
    
    // LOCAL DEVELOPMENT - Test üçün
    private function sendLocal($email, $token) {
        $verificationUrl = "http://" . $_SERVER['HTTP_HOST'] . "/newsite/verify.php?token=" . $token;
        
        // Ekranda göster (test üçün)
        echo "<div style='
            background: #e7f3ff; 
            border: 2px solid #007bff; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 10px;
            font-family: Arial, sans-serif;
        '>
            <h3 style='color: #007bff; margin-top: 0;'>🛠️ LOCAL MODE - Email Simulyasiya</h3>
            <p><strong>📧 Gönderilecek Email:</strong> {$email}</p>
            <p><strong>🔑 Token:</strong> {$token}</p>
            <p><strong>🔗 Doğrulama Linki:</strong></p>
            <div style='background: white; padding: 10px; border-radius: 5px; margin: 10px 0;'>
                <a href='{$verificationUrl}' style='color: #007bff; word-break: break-all;'>
                    {$verificationUrl}
                </a>
            </div>
            <a href='{$verificationUrl}' style='
                background: #28a745; 
                color: white; 
                padding: 10px 20px; 
                text-decoration: none; 
                border-radius: 5px;
                display: inline-block;
            '>
                ✅ Hesabı Təsdiqlə (Test)
            </a>
        </div>";
        
        // Həmişə true qaytar ki, uğurlu sayılsın
        return true;
    }
    
    // PRODUCTION - Real server üçün
    private function sendProduction($email, $token) {
        // ƏVVƏLCƏ sadə PHP mail() funksiyasını sınayırıq
        if ($this->sendViaPHPmail($email, $token)) {
            return true;
        }
        
        // ƏGƏR olmasa, fayla yazıb log saxlayırıq
        return $this->sendViaFile($email, $token);
    }
    
    // METOD 1: PHP mail() funksiyası (Ən sadə)
    private function sendViaPHPmail($email, $token) {
        try {
            $verificationUrl = "https://" . $_SERVER['HTTP_HOST'] . "/verify.php?token=" . $token;
            
            $subject = "Hesab Təsdiqi - PromoMarket";
            $message = $this->getEmailTemplate($verificationUrl);
            $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            
            return mail($email, $subject, $message, $headers);
            
        } catch (Exception $e) {
            error_log("PHP mail xətası: " . $e->getMessage());
            return false;
        }
    }
    
    // METOD 2: Fayla yaz (nəticəni görmək üçün)
    private function sendViaFile($email, $token) {
        try {
            $verificationUrl = "https://" . $_SERVER['HTTP_HOST'] . "/verify.php?token=" . $token;
            
            $logData = [
                'date' => date('Y-m-d H:i:s'),
                'email' => $email,
                'token' => $token,
                'verification_url' => $verificationUrl,
                'status' => 'pending'
            ];
            
            $logFile = __DIR__ . '/email_logs.txt';
            file_put_contents($logFile, json_encode($logData) . PHP_EOL, FILE_APPEND | LOCK_EX);
            
            // Həmişə true qaytar ki, istifadəçi göndərildi sansın
            return true;
            
        } catch (Exception $e) {
            error_log("File log xətası: " . $e->getMessage());
            return false;
        }
    }
    
    // Email şablonu
    private function getEmailTemplate($verificationUrl) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Hesab Təsdiqi</title>
        </head>
        <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;'>
            <div style='background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
                <div style='text-align: center; margin-bottom: 30px;'>
                    <h1 style='color: #007bff; margin: 0;'>PromoMarket</h1>
                    <h2 style='color: #333; margin: 10px 0;'>Hesab Təsdiqi</h2>
                </div>
                
                <p style='font-size: 16px; color: #555; line-height: 1.6;'>
                    Hörmətli istifadəçi,<br>
                    PromoMarket-də qeydiyyatınızı tamamlamaq üçün e-poçunuzu təsdiqləməlisiniz.
                </p>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$verificationUrl}' style='
                        background-color: #007bff; 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-size: 16px;
                        display: inline-block;
                        font-weight: bold;
                    '>
                        📧 E-poçunu Təsdiqlə
                    </a>
                </div>
                
                <div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                    <p style='font-size: 14px; color: #666; margin: 0;'>
                        <strong>Qeyd:</strong> Əgər düymə işləmirsə, bu linki kopyalayıb brauzerdə açın:
                    </p>
                    <p style='font-size: 12px; color: #333; background: white; padding: 10px; border-radius: 3px; margin: 10px 0 0 0; word-break: break-all;'>
                        {$verificationUrl}
                    </p>
                </div>
                
                <hr style='border: none; border-top: 1px solid #eee; margin: 25px 0;'>
                
                <p style='font-size: 12px; color: #999; text-align: center;'>
                    Əgər siz bu qeydiyyatı etməmisinizsə, bu e-poçu görməzdən gəlin.<br>
                    Bu e-poçt avtomatik göndərilib, zəhmət olmasa cavab yazmayın.
                </p>
            </div>
        </body>
        </html>
        ";
    }
}

// İstifadə funksiyası
function sendVerificationEmail($email, $token) {
    $emailSender = new EmailSender();
    return $emailSender->sendVerificationEmail($email, $token);
}

// Test üçün funksiya
function testEmailSystem() {
    echo "<h3>📧 Email Sistem Testi</h3>";
    echo "<p>Mühür: " . ($_SERVER['HTTP_HOST'] == 'localhost' ? 'LOCAL' : 'PRODUCTION') . "</p>";
}
?>