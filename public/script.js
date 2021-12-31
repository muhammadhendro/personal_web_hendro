function submitForm() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let nohp = document.getElementById("nohp").value;
  let subject = document.getElementById("subject").value;
  let message = document.getElementById("message").value;

  //   console.log(
  //     `Name: ${name}, email: ${email}, nohp: ${nohp}, subject: ${subject}, message: ${message}`
  //   );

  if (!name || !email || !nohp || !subject || !message) {
    return alert('Nama, email, nohp dan message harus diisi!');
  }

  let emailReceiver = "mhendroj@gmail.com";

  let a = document.createElement("a");
  a.href = `mailto:${emailReceiver}?subject=${subject}&body= halo my name ${name}, ${message}`;
  a.click();

  let dataObject = {
    name: name,
    email: email,
    phoneNumber: nohp,
    subject: subject,
    message: message,
  };
  console.log(dataObject);
}


