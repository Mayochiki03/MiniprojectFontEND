// Tabs functionality and image filtering
const tabs = document.querySelectorAll('.tab');
const imageCards = document.querySelectorAll('.image-card');
const form = document.getElementById('uploadForm');
const errorMessage = document.getElementById('errorMessage');
const uploadOverlay = document.getElementById('uploadOverlay');
const imageInput = document.getElementById('image');
const fileNameDisplay = document.getElementById('fileName');

// Tab Functionality
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const tabText = tab.textContent.trim();

    imageCards.forEach(card => {
      card.style.display = 'none';
    });

    if (tabText === "ทั้งหมด") {
      imageCards.forEach(card => {
        card.style.display = 'block';
      });
    } else {
      imageCards.forEach(card => {
        if (card.querySelector('p').textContent.includes(tabText)) {
          card.style.display = 'block';
        }
      });
    }
  });
});

// Show Upload Overlay
document.getElementById('addBtn').addEventListener('click', () => {
  uploadOverlay.style.display = 'flex';
});

// Close Overlay
function closeOverlay() {
  uploadOverlay.style.display = 'none';
}

// Form Submission for Upload
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const category = document.getElementById('category').value;
  const name = document.getElementById('name').value;
  const image = document.getElementById('image').files[0];
  const decorationsType = document.getElementById('decorations_type').value;

  if (!category || !name || !image || !decorationsType) {
    errorMessage.textContent = 'โปรดระบุข้อมูลให้ครบถ้วน';
    return;
  }

  const formData = new FormData();
  formData.append('category', category);
  formData.append('name', name);
  formData.append('image', image);
  formData.append('decorations_type', decorationsType);

  try {
    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Upload successful!');
      form.reset();
      closeOverlay();
      fetchImages(); // Reload images after upload
    } else {
      errorMessage.textContent = 'Failed to upload image';
    }
  } catch (error) {
    errorMessage.textContent = 'An error occurred: ' + error.message;
  }
});

// Display Selected File Name
imageInput.addEventListener('change', () => {
  if (imageInput.files.length > 0) {
    fileNameDisplay.textContent = 'ชื่อไฟล์ที่เลือก: ' + imageInput.files[0].name;
  } else {
    fileNameDisplay.textContent = 'ชื่อไฟล์ที่เลือก: ไม่มี';
  }
});

// Fetch Images
async function fetchImages() {
  const response = await fetch('http://localhost:3001/api/images');
  const images = await response.json();

  const gallery = document.getElementById("imageGallery");
  gallery.innerHTML = '';

  images.forEach((image) => {
    const container = document.createElement("div");
    container.classList.add("imageContainer");

    const img = document.createElement("img");
    img.src = `data:image/png;base64,${image.image}`;
    img.alt = image.name;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.textContent = "ลบ";
    deleteButton.onclick = () => deleteImage(image.id);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    const updateButton = document.createElement("button");
    updateButton.classList.add("updateButton");
    updateButton.textContent = "อัปเดตรูปภาพ";
    updateButton.onclick = () => updateImageFile(image.id, fileInput.files[0]);

    container.appendChild(img);
    container.appendChild(fileInput);
    container.appendChild(updateButton);
    container.appendChild(deleteButton);
    gallery.appendChild(container);
  });
}
// แสดง Overlay เมื่อคลิกปุ่มลบ
async function deleteImage(id) {
  // เปิด overlay สำหรับยืนยันการลบ
  openOverlay();
  
  if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบภาพนี้?")) {
    try {
      const response = await fetch(`http://localhost:3001/api/images/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        fetchImages(); // Reload images after deletion
        closeOverlay(); // ปิด overlay หลังจากลบ
      } else {
        alert(result.message);
        closeOverlay(); // ปิด overlay หากลบไม่สำเร็จ
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการลบภาพ');
      closeOverlay(); // ปิด overlay เมื่อเกิดข้อผิดพลาด
    }
  } else {
    closeOverlay(); // ปิด overlay เมื่อยกเลิกการลบ
  }
}

// แสดง Overlay เมื่อคลิกปุ่มอัปเดตภาพ
async function updateImageFile(id, newFile) {
  if (!newFile) {
    alert("กรุณาเลือกไฟล์รูปภาพก่อนที่จะอัปเดต");
    return;
  }

  openOverlay(); // เปิด overlay ระหว่างการอัปเดต

  const formData = new FormData();
  formData.append('image', newFile);

  try {
    const response = await fetch(`http://localhost:3001/api/images/${id}`, {
      method: 'PUT',
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      fetchImages(); // Reload images after update
      closeOverlay(); // ปิด overlay หลังจากอัปเดต
    } else {
      alert(result.message);
      closeOverlay(); // ปิด overlay หากอัปเดตไม่สำเร็จ
    }
  } catch (error) {
    console.error('Error:', error);
    alert('เกิดข้อผิดพลาดในการอัปเดตรูปภาพ');
    closeOverlay(); // ปิด overlay เมื่อเกิดข้อผิดพลาด
  }
}

// แสดง Overlay ทั่วไป
function openOverlay() {
  uploadOverlay.style.display = 'flex'; // เปิด overlay
}

// ปิด Overlay
function closeOverlay() {
  uploadOverlay.style.display = 'none'; // ปิด overlay
}

// ฟังก์ชันเปิด overlay สำหรับการอัปเดตรูปภาพ
function openEditOverlay() {
  console.log("เปิด overlay");
  document.getElementById('editOverlay').style.display = 'flex'; // เปิด overlay
}

// ฟังก์ชันปิด overlay สำหรับการอัปเดตรูปภาพ
function closeEditOverlay() {
  document.getElementById('editOverlay').style.display = 'none'; // ปิด overlay
}
function opendeleteImage() {
  console.log("เปิด overlay");
  document.getElementById('deleteOverlay').style.display = 'flex'; // เปิด overlay
}

// ฟังก์ชันปิด overlay สำหรับการอัปเดตรูปภาพ
function closedeleteImage() {
  document.getElementById('deleteOverlay').style.display = 'none'; // ปิด overlay
}

// Initialize page with images
fetchImages();

// ฟังก์ชันแสดงโอเวอร์เลย์
function showOverlay() {
  document.getElementById("deleteOverlay").style.display = "flex";
}

// ฟังก์ชันปิดโอเวอร์เลย์
document.getElementById("deleteOverlay").addEventListener("click", function() {
  document.getElementById("deleteOverlay").style.display = "none";
});
