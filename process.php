<?php
// process.php
header('Content-Type: application/json');
include 'db.php';

if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'get_approved_codes':
            $filters = [
                'category' => $_GET['category'] ?? 'all',
                'search' => $_GET['search'] ?? ''
            ];
            
            $codes = $db->getApprovedCodes($filters);
            echo json_encode(['success' => true, 'codes' => $codes]);
            break;
            
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No action specified']);
}
?>