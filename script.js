// Kontaktformular Validation. Quelle: Bootstrap Docs: https://getbootstrap.com/docs/5.3/forms/validation/
(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

// E-Mail Schutz für den Footer
document.addEventListener('DOMContentLoaded', function() {
    // Einstellungen für die E-Mail
    var user = 'info';
    var domain = 'bucher-isolierungen.de';
    var email = user + '@' + domain;

    // Suche ALLE Elemente mit der Klasse 'kontakt-email-placeholder'
    var emailElements = document.querySelectorAll('.kontakt-email-placeholder');

    // Gehe jedes gefundene Element durch und füge die E-Mail ein
    emailElements.forEach(function(element) {
        element.innerHTML = '<a href="mailto:' + email + '" class="text-light text-decoration-none">' + email + '</a>';
    });
});