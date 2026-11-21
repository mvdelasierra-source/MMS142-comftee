document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("emailAddress").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const message = document.getElementById("message").value.trim();

    const subject = encodeURIComponent(`COMFTEE Contact Form - ${fullName}`);
    const body = encodeURIComponent(
      `Name: ${fullName}\nEmail: ${email}\nPhone number: ${phone}\n\nMessage:\n${message}`
    );

    const mailtoLink =
      `mailto:hello@comftee142.com?subject=${subject}&body=${body}`;

    if (formNote) {
      formNote.textContent = "Opening your email app...";
    }

    window.location.href = mailtoLink;
  });
});