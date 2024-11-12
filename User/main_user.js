// ฟังก์ชันสำหรับการทำงานของสไลเดอร์
const slider = document.querySelector('.slider');

function activate(e) {
  const items = document.querySelectorAll('.item');
  if (e.target.matches('.next')) {
    slider.append(items[0]);
  }
  if (e.target.matches('.prev')) {
    slider.prepend(items[items.length - 1]);
  }
}

document.addEventListener('click', activate, false);

// ฟังก์ชันสำหรับการทำงานของปุ่ม Show More ใน .item
document.querySelectorAll('.item button').forEach(button => {
  button.addEventListener('click', function (event) {
    const content = this.parentElement;
    content.classList.toggle('expanded');

    // เปลี่ยนข้อความในปุ่มระหว่าง "Read More" และ "Read Less"
    this.textContent = content.classList.contains('expanded') ? 'Read Less' : 'Read More';
  });
});

// ฟังก์ชันสำหรับการทำงานของปุ่ม Activity Button
document.querySelector('#activity_button').addEventListener('click', function (event) {
  // หยุดการส่งต่อเหตุการณ์เพื่อไม่ให้เกิดผลกระทบกับฟังก์ชันอื่น
  event.stopPropagation();
  
  // เปลี่ยนข้อความในปุ่ม activity_button เพื่อไม่ให้แสดง "Show Less"
  const button = document.querySelector('#activity_button');
  button.textContent = 'ร่วมสนุกกับกิจกรรม';

  // ทำงานของปุ่มคือไปยังหน้ากิจกรรม
  window.location.href = 'Activity.html';
});
