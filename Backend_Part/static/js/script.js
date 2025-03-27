// Plotly rendering
Plotly.newPlot('graph1', JSON.parse(document.getElementById('graph1-data').textContent));
Plotly.newPlot('graph2', JSON.parse(document.getElementById('graph2-data').textContent));

// Toggle Form
function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.style.display = form.style.display === "none" ? "block" : "none";
}

// AJAX form submission
async function submitForm(event, formId) {
    event.preventDefault();
    
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    
    const response = await fetch("http://localhost:5000/CSV/chat", {
        method: "POST",
        body: formData
    });

    const result = await response.text();
    document.getElementById(`${formId}-result`).innerHTML = result;
}
