const unlockedSteps = new Set([1]); // 預設只允許進入 step 1

window.onload = function () {

const confirmModal = document.getElementById('confirmModal');

document.querySelectorAll('.step-item').forEach(item => {
  item.addEventListener('click', function () {
    const targetStep = parseInt(this.dataset.step);
    if (unlockedSteps.has(targetStep)) {
      nextStep(targetStep);
    } else {
      alert("請先完成前一步的資料再繼續！");
    }
  });
});

  const form = document.getElementById('orderForm');
  const orderSummary = document.getElementById('orderSummary');
  const finalInfo = document.getElementById('finalInfo');

  const tableBody = document.querySelector('#checkout-table tbody');
  const totalEl = document.getElementById('total-price');
  const cartData = JSON.parse(localStorage.getItem('checkoutCart')) || [];

  let total = 0;
  cartData.forEach(item => {
    const row = document.createElement('tr');
    const subtotal = item.price * item.quantity;
    total += subtotal;
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>NT$${item.price.toFixed(2)}</td>
      <td>NT$${subtotal.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });
  totalEl.innerText = `NT$${total.toFixed(2)}`;

  // checkbox自動填入收貨人
  document.getElementById("sameAsBuyer").addEventListener("change", function () {
    if (this.checked) {
      document.querySelector('input[name="recipientName"]').value = document.querySelector('input[name="buyerName"]').value;
      document.querySelector('input[name="recipientPhone"]').value = document.querySelector('input[name="buyerPhone"]').value;
    } else {
      document.querySelector('input[name="recipientName"]').value = "";
      document.querySelector('input[name="recipientPhone"]').value = "";
    }
  });

  // 表單送出處理
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const buyerName = document.getElementById('buyerName').value;
    const buyerPhone = document.getElementById('buyerPhone').value;
    const buyerLineId = document.getElementById('buyerLineId').value;
    const deliveryDate = document.getElementById('deliveryDate').value;
    const deliveryTime = document.getElementById('deliveryTime').value;
    const deliveryLocation = document.getElementById('deliveryLocation').value;
    const recipientName = document.getElementById('recipientName').value;
    const recipientPhone = document.getElementById('recipientPhone').value;
    const receiptOption = document.getElementById('receiptOption').value;
    const taxId = document.getElementById('taxId').value;

    orderSummary.innerHTML = `
      <p><strong>訂購人姓名：</strong>${buyerName}</p>
      <p><strong>訂購人電話：</strong>${buyerPhone}</p>
      <p><strong>Line ID：</strong>${buyerLineId}</p>
      <p><strong>送達日期：</strong>${deliveryDate}</p>
      <p><strong>送達時間：</strong>${deliveryTime}</p>
      <p><strong>送達地點：</strong>${deliveryLocation}</p>
      <p><strong>發票選項：</strong>${receiptOption}</p>
      ${receiptOption === "統編" ? `<p><strong>統編：</strong>${taxId}</p>` : ""}
    `;

    finalInfo.innerHTML = `
      <p><strong>收貨人姓名：</strong>${recipientName}</p>
      <p><strong>收貨人電話：</strong>${recipientPhone}</p>
    `;

    confirmModal.style.display = 'block';
  });

  // 加入 global 作用域，供 HTML 中的 button 使用
  window.nextToReceipt = function () {
    confirmModal.style.display = 'none';
    // 如果你之後想真的送出表單：form.submit();

  const tempForm = document.createElement("form");
  tempForm.method = "POST";
  tempForm.action = "https://script.google.com/macros/s/AKfycbwgLrY-UA6IahN1QaUFiw-xzqN1UQcqym1mZuBJUdo0vyioxGI_d-82vs_Paywb_QC9/exec";


  const addField = (name, value) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    tempForm.appendChild(input);
  };

  // 加入各欄位
  addField("buyerName", document.getElementById("buyerName").value);
  addField("buyerPhone", document.getElementById("buyerPhone").value);
  addField("buyerLineId", document.getElementById("buyerLineId").value);
  addField("deliveryDate", document.getElementById("deliveryDate").value);
  addField("deliveryTime", document.getElementById("deliveryTime").value);
  addField("deliveryLocation", document.getElementById("deliveryLocation").value);
  addField("recipientName", document.getElementById("recipientName").value);
  addField("recipientPhone", document.getElementById("recipientPhone").value);
  addField("receiptOption", document.getElementById("receiptOption").value);
  addField("taxId", document.getElementById("taxId").value);


  const cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
  addField("cartItems", JSON.stringify(cart));

  document.body.appendChild(tempForm);
  tempForm.submit();

  alert("✅ 訂單已送出！我們會用 LINE 與您聯繫！");

  };

};

document.getElementById("receiptOption").addEventListener("change", function () {
 const taxIdField = document.getElementById("taxIdField");
 const taxIdInput = document.getElementById("taxId");
    if (this.value === "統編") {
      taxIdField.style.display = "block";
    } else {
      taxIdField.style.display = "none";
      taxIdInput.value = "";
    }
});

function nextStep(step) {
  if (step === 3) {
    const buyerName = document.getElementById('buyerName').value.trim();
    const buyerPhone = document.getElementById('buyerPhone').value.trim();
    const phonePattern = /^09\d{8}$|^0[2-8]\d{6,8}$/;
    if (!phonePattern.test(buyerPhone)) {
      alert("請輸入正確的手機或市話號碼！");
      return;
    }
     
    const buyerLineId = document.getElementById('buyerLineId').value.trim();
    const deliveryDate = document.getElementById('deliveryDate').value.trim();
    const deliveryTime = document.getElementById('deliveryTime').value.trim();
    const deliveryLocation = document.getElementById('deliveryLocation').value.trim();
    const recipientName = document.getElementById('recipientName').value.trim();
    const recipientPhone = document.getElementById('recipientPhone').value.trim();
    const receiptOption = document.getElementById('receiptOption').value;
    const taxId = document.getElementById('taxId').value.trim();

    if (receiptOption === "統編" && taxId === "") {
      alert("請輸入統編！");
      return;
    }

    if (
      buyerName === "" ||
      buyerPhone === "" ||
      buyerLineId === "" ||
      deliveryDate === "" ||
      deliveryTime === "" ||
      deliveryLocation === "" ||
      recipientName === "" ||
      recipientPhone === ""
    ) {
      alert("請完整填寫所有欄位再繼續");
      return;
    }
  }
  
  if(step === 2) unlockedSteps.add(2);

  if (step === 3 && !unlockedSteps.has(2)) {
    alert("請先完成 Step 2 再進入確認頁面！");
    return;
  }

  // 確保step也被加入 unlockedSteps (可以不加這行看你需求)
  unlockedSteps.add(step);

 document.querySelectorAll(".step-content").forEach(el => el.classList.remove("active"));
 document.getElementById("step" + step).classList.add("active");

  updateProgress(step);

  if (step === 3) {
  // 取資料
  const buyerName = document.getElementById('buyerName').value;
  const buyerPhone = document.getElementById('buyerPhone').value;
  const buyerLineId = document.getElementById('buyerLineId').value;
  const deliveryDate = document.getElementById('deliveryDate').value;
  const deliveryTime = document.getElementById('deliveryTime').value;
  const deliveryLocation = document.getElementById('deliveryLocation').value;
  const recipientName = document.getElementById('recipientName').value;
  const recipientPhone = document.getElementById('recipientPhone').value;
  const receiptOption = document.getElementById('receiptOption').value;
  const taxId = document.getElementById('taxId').value;

  // 訂購人資料表格
  let customerSummary = `
    <h3>訂購人資料</h3>
    <table>
      <tbody>
        <tr><th>姓名</th><td>${buyerName}</td></tr>
        <tr><th>手機</th><td>${buyerPhone}</td></tr>
        <tr><th>Line ID</th><td>${buyerLineId}</td></tr>
        <tr><th>送達日期</th><td>${deliveryDate}</td></tr>
        <tr><th>送達時間</th><td>${deliveryTime}</td></tr>
        <tr><th>送達地址</th><td>${deliveryLocation}</td></tr>
        <tr><th>發票選項</th><td>${receiptOption}${receiptOption === "統編" ? ` (統編: ${taxId})` : ""}</td></tr>
      </tbody>
    </table>
  `;

  // 收貨人資料表格
  let recipientSummary = `
    <h3>收貨人資料</h3>
    <table>
      <tbody>
        <tr><th>姓名</th><td>${recipientName}</td></tr>
        <tr><th>手機</th><td>${recipientPhone}</td></tr>
      </tbody>
    </table>
  `;

  // 購物車訂單表格 (你原本的就差不多，這邊加點 style)
  let cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
  let cartSummary = `
    <h3>訂購餐點</h3>
    <table>
      <thead>
        <tr>
          <th>品項</th><th>數量</th><th>單價</th><th>小計</th>
        </tr>
      </thead>
      <tbody>
  `;

  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    cartSummary += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.price.toFixed(2)}</td>
        <td>NT$${subtotal.toFixed(2)}</td>
      </tr>
    `;
  });

  cartSummary += `
      <tr style="font-weight:bold; background-color:#d9edf7;">
        <td colspan="3" style="text-align:right;">總計</td>
        <td>NT$${total.toFixed(2)}</td>
      </tr>
      </tbody>
    </table>
  `;

  document.getElementById("confirm-summary").innerHTML = customerSummary + recipientSummary + cartSummary;
}
}

    function prevStep(step) {
      document.querySelectorAll(".step-content").forEach(el => el.classList.remove("active"));
      document.getElementById("step"+step).classList.add("active");
       updateProgress(step);
    }
    function submitOrder() {
      alert("訂單已送出！我們會盡快與您聯繫！");
      location.href="index.html";
    }
    // 同步收件人
    document.getElementById("sameAsBuyer").addEventListener("change", function() {
      if (this.checked) {
        document.getElementById("recipientName").value = document.getElementById("buyerName").value;
        document.getElementById("recipientPhone").value = document.getElementById("buyerPhone").value;
      }
    });
    // 統編顯示
    document.getElementById("receiptOption").addEventListener("change", function(){
      if (this.value === "統編") {
        document.getElementById("taxIdField").style.display="block";
      } else {
        document.getElementById("taxIdField").style.display="none";
      }
    });

  function updateProgress(step) {
  // 重置
  document.querySelectorAll(".step-circle").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".step-line").forEach(el => el.classList.remove("active"));

  // 依照目前的 step，改亮
  if (step >= 1) {
    document.getElementById("circle1").classList.add("active");
  }
  if (step >= 2) {
    document.getElementById("circle2").classList.add("active");
    document.getElementById("line1").classList.add("active");
  }
  if (step >= 3) {
    document.getElementById("circle3").classList.add("active");
    document.getElementById("line2").classList.add("active");
  }
}
