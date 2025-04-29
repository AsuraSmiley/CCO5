import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js"
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyAlq3HZwuk-wk2aFxERWWBm2rSH1eSXOoc",
  authDomain: "student-queue-system.firebaseapp.com",
  projectId: "student-queue-system",
  storageBucket: "student-queue-system.firebasestorage.app",
  messagingSenderId: "891032727765",
  appId: "1:891032727765:web:134c260550e58a1be6325c",
  measurementId: "G-15PJS2C6KF",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

function login() {
  const email = document.getElementById("email").value.trim()
  const password = document.getElementById("password").value.trim()

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("loginSection").classList.add("hidden")
      document.getElementById("formSection").classList.remove("hidden")
    })
    .catch((error) => alert("Login failed: " + error.message))
}

// Make login function accessible to inline onclick in HTML
window.login = login

async function submitQueue() {
  const name = document.getElementById("name").value
  const service = document.getElementById("service").value
  const time = new Date().toLocaleString()

  if (!name || !service) {
    alert("Please fill in all fields.")
    return
  }

  const q = query(collection(db, "queue"), orderBy("timestamp", "desc"), limit(1))
  const snapshot = await getDocs(q)

  let lastNum = 0
  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      const last = doc.data()
      lastNum = Number.parseInt(last.queueNumber.replace("Q", ""))
    })
  }

  const newNumber = "Q" + String(lastNum + 1).padStart(3, "0")

  await addDoc(collection(db, "queue"), {
    name,
    service,
    queueNumber: newNumber,
    timestamp: new Date(),
  })

  document.getElementById("formSection").classList.add("hidden")
  document.getElementById("ticketSection").classList.remove("hidden")

  document.getElementById("ticketName").innerText = name
  document.getElementById("ticketService").innerText = service
  document.getElementById("ticketNumber").innerText = newNumber
  document.getElementById("ticketTime").innerText = time

  document.getElementById("printTicketName").innerText = name
  document.getElementById("printTicketService").innerText = service
  document.getElementById("printTicketNumber").innerText = newNumber
  document.getElementById("printTicketTime").innerText = time
}

function printTicket() {
  window.print()
}

function downloadPDF() {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  })

  const queueNumber = document.getElementById("ticketNumber").innerText
  const name = document.getElementById("ticketName").innerText
  const service = document.getElementById("ticketService").innerText
  const time = document.getElementById("ticketTime").innerText

  doc.setFontSize(22)
  doc.setTextColor(0, 106, 113)
  doc.text("Student Queue Ticket", 105, 20, { align: "center" })

  doc.setFontSize(32)
  doc.setTextColor(72, 166, 167)
  doc.text(queueNumber, 105, 40, { align: "center" })

  doc.setFontSize(14)
  doc.setTextColor(51, 51, 51)
  doc.text(`Name: ${name}`, 20, 60)
  doc.text(`Service: ${service}`, 20, 70)
  doc.text(`Time: ${time}`, 20, 80)

  doc.setDrawColor(72, 166, 167)
  doc.setLineWidth(0.5)
  doc.rect(10, 10, 128, 80)

  doc.save(`${queueNumber}_Ticket.pdf`)
}

function goBack() {
  document.getElementById("formSection").classList.add("hidden")
  document.getElementById("loginSection").classList.remove("hidden")
}

function goBackToForm() {
  document.getElementById("ticketSection").classList.add("hidden")
  document.getElementById("formSection").classList.remove("hidden")
}