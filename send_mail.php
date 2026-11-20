<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Sprawdzanie honeypota (anty-spam)
    if (!empty($_POST['company'])) {
        // Jeśli pole jest wypełnione, to znaczy, że zrobił to bot
        die("Spam detected");
    }

    // 2. Konfiguracja adresu docelowego
    $to = "kontakt@klinika-czystosci.pl";
    $subject = "Nowa wiadomość ze strony Klinika Czystości";

    // 3. Pobieranie danych tekstowych z formularza
    $name = htmlspecialchars($_POST['name']);
    $phone = htmlspecialchars($_POST['phone']);
    $message_text = htmlspecialchars($_POST['message']);

    // 4. Obsługa checkboxów z różnych podstron
    $selected_services = [];

    // Sprawdzamy podstronę: Tapicerka meblowa
    if (!empty($_POST['upholstery_types']) && is_array($_POST['upholstery_types'])) {
        foreach ($_POST['upholstery_types'] as $val) {
            // ucfirst zamienia pierwszą literę na wielką (np. "kanapa" na "Kanapa")
            $selected_services[] = ucfirst(htmlspecialchars($val));
        }
    }

    // Sprawdzamy podstronę: Tapicerka samochodowa
    if (!empty($_POST['car_services']) && is_array($_POST['car_services'])) {
        foreach ($_POST['car_services'] as $val) {
            $selected_services[] = ucfirst(htmlspecialchars($val));
        }
    }

    // Sprawdzamy podstronę: Usługi sprzątania
    if (!empty($_POST['cleaning_services']) && is_array($_POST['cleaning_services'])) {
        foreach ($_POST['cleaning_services'] as $val) {
            $selected_services[] = ucfirst(htmlspecialchars($val));
        }
    }

    // Łączymy wybrane opcje w jeden czytelny ciąg tekstu
    if (!empty($selected_services)) {
        $services_text = implode(", ", $selected_services);
    } else {
        $services_text = "Nie zaznaczono żadnej opcji.";
    }

    // 5. Budowanie treści maila
    $body = "Masz nową wiadomość od klienta!\n\n";
    $body .= "Imię: $name\n";
    $body .= "Telefon: $phone\n";
    $body .= "Wybrane usługi: $services_text\n\n";
    $body .= "Treść wiadomości:\n$message_text\n";

    // 6. Nagłówki (UTF-8 zapewnia poprawne wyświetlanie polskich znaków)
    $headers = "From: Klinika Czystosci <no-reply@klinika-czystosci.pl>\r\n";
    $headers .= "Reply-To: $to\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

    // 7. Wysyłka wiadomości
    if (mail($to, $subject, $body, $headers)) {
        // Automatyczny powrót na stronę, z której wysłano formularz
        $redirect = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : "../index.html";
        // Usuwamy stare parametry z adresu URL, by zachować porządek
        $redirect = explode('?', $redirect)[0]; 
        
        header("Location: " . $redirect . "?status=ok#kontakt");
    } else {
        echo "Błąd serwera. Nie udało się wysłać maila.";
    }
} else {
    echo "Dostęp zabroniony.";
}
?>