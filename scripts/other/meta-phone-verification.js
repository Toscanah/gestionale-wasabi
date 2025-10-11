function reg() {
  fetch("http://localhost:8080/v1/account/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer EAAH1ZAZBPvsEsBPF397ylb4d2PSTI7i9rJ3ZCxWvAFDoZAbuFiGINT6DYyRSFb3yN1xZBifmZA9o9JYjvhUWYCnhSqZAI7FLqU1S48spDE8CbailWZB7Y5fhQrku2bHQJ1ZBnLZCUY9aRAzJIitfVfZCUoos4OW92Te0I1t8ZBe9npHq1zH4pqZBDQJkSaQ5glw0iWELOiIdC9H15WywgAvUsLEZB4mdi3nVMc8eMADUs9cVPH",
    },
    body: JSON.stringify({
      cc: "39",
      cert: "CmkKJQim3ceC/LLVAxIGZW50OndhIgxXYXNhYmkgU3VzaGlQldr9wwYaQG61czg6n5MTliEnZUhMY2h6NiiHFXon08PyOyZ7kLhkFnV+ozpdcUgDetI0Z20gGI0xt8jftuz3ChP3IHcUWgsSL20RX+fD9eC08FqysZGvbiGUWOPtWsDxBdMWfIuLHPwzoj+S7AaiSN2ratIa6b29",
      phone_number: "3381278651",
      method: "sms",
    }),
  })
    .then((res) => res.json())
    .then(console.log)
    .catch((err) => {
      console.error("Full error:");
      console.dir(err, { depth: null });
    });
}

reg();
