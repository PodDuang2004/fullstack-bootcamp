let isChanged = false;
// ข้อมูลโปรไฟล์
const profile = {
    name: "Kritawat",
    age: 22,
    university: "มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ",
    interests: "Web Development & Data Analysis"
};

// ฟังก์ชันสลับข้อความแนะนำตัว
function changeMessage() {
  const message = document.getElementById("welcome-message");
  const button = document.getElementById("message-button");

  if (!message || !button) {
    console.error("ไม่พบ element id 'welcome-message' หรือ 'message-button'");
    return;
  }

  if (!isChanged) {
    message.textContent = `ผมชื่อ ${profile.name} (อายุ ${profile.age} ปี) จาก ${profile.university} สนใจด้าน ${profile.interests} ครับ`;
    button.textContent = "ย่อข้อความ";
    isChanged = true;
  } else {
    message.textContent = "ยินดีต้อนรับเข้าสู่ Portfolio ของผม";
    button.textContent = "รู้จักผมมากขึ้น";
    isChanged = false;
  }
}

// 3. ฟังก์ชันทักทาย
function greeting() {
  const visitorName = prompt("กรุณาใส่ชื่อของคุณ:");

  if (visitorName && visitorName.trim() !== "") {
    alert(`สวัสดีครับคุณ ${visitorName.trim()} ยินดีต้อนรับสู่ Portfolio ของผม!`);
  }
}

// 3. ระบบส่งฟอร์มติดต่อ (Contact Form -> Backend)
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("user-name").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const message = document.getElementById("user-message").value.trim();

    if (!name || !email || !message) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("ส่งข้อความเรียบร้อยแล้ว!");
        contactForm.reset();
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการส่งข้อความ");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (โปรดตรวจสอบว่า Backend รันอยู่)");
    }
  });
}
/*console.log("Hello Javascript");
let name = "Kritawat ";
console.log(name); #เปลียนค่าได้

const university = "Rajamangala University of Technology Krungthep";
console.log(university);   #ไม่ควรเปลี่ยนค่า

function sayHello() {
    console.log("สวัสดีครับ");
}   
sayHello();*/

/*function showMessage() {
    alert("ขอบคุณที่มาเยี่ยมชม Portfolio ของผม"); #สวัสดีครับยินดีต้อนรับสู่Portfolioของผม          
}

/*function sayHello(name) { pamaeter
    console.log("สวัสดีครับ " + name);
}
sayHello("Kritawat"); agument */

/*const name = "Kritawat";
function sayHello(name) {
    alert(`สวัสดีครับ ${name}`); 
}
sayHello(name);

function changeMessage() {

    document.getElementById("welcome-message").textContent =
        "ขอบคุณที่เข้ามาชม Portfolio ของผมครับ!";

}  */   
/*let name = "Kritawat"; //let เปลี่ยนค่าได้
let age = 22;

const university = "มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ"; //const ค่าคงที่ */

/*console.log("Hello JavaScript");

let name = "Kritawat";
let age = 22;

const university =
    "มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ";


function sayHello() {
    console.log("สวัสดีครับ");
}   
sayHello();

function showMessage() {

    alert(
        "สวัสดีครับ ยินดีต้อนรับเข้าสู่ Portfolio ของผม!"
    );

}


// DOM + if/else

let isChanged = false;

function changeMessage() {

    const message =
        document.getElementById("welcome-message");

    const button =
        document.getElementById("message-button");

    if (isChanged === false) {

        message.textContent =
            "ผมเป็นนักศึกษาวิทยาการคอมพิวเตอร์ที่สนใจ Web Development และ Software Engineering ครับ";

        button.textContent = "ซ่อนข้อความ";

        isChanged = true;

    } else {

        message.textContent =
            "ยินดีต้อนรับเข้าสู่ Portfolio ของผม";

        button.textContent = "รู้จักผมมากขึ้น";

        isChanged = false;

    }

}


// Prompt

function greeting() {

    const visitorName =
        prompt("กรุณาใส่ชื่อของคุณ");

    alert("สวัสดีครับ " + visitorName);

}   */