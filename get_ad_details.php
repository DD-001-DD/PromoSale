
Action: file_editor create /app/get_ad_details.php --file-text "<?php
header('Content-Type: application/json');
include 'config.php';

$ad_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$type = isset($_GET['type']) ? $_GET['type'] : 'pending';

$response = [];

if ($ad_id > 0) {
    if ($type === 'approved') {
        $query = \"SELECT a.*, u.username 
                  FROM approved_ads a 
                  LEFT JOIN users u ON a.user_id = u.id 
                  WHERE a.id = $ad_id\";
    } else {
        $query = \"SELECT p.*, u.username 
                  FROM pending_ads p 
                  LEFT JOIN users u ON p.user_id = u.id 
                  WHERE p.id = $ad_id\";
    }
    
    $result = $conn->query($query);
    
    if ($result && $result->num_rows > 0) {
        $response = $result->fetch_assoc();
    } else {
        $response = ['error' => 'Ad not found'];
    }
} else {
    $response = ['error' => 'Invalid ID'];
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
"
Observation: Create successful: /app/get_ad_details.php