 const menu ={

  main : {
    "乳酪肉鬆": 95,
    "法式鮪魚": 95,
    "日式蛋沙拉": 95,
    "咖哩可樂餅": 95,
    "厚蛋培根": 130,
    "素食厚蛋": 120,
    "起司德腸": 150,
    "辣肉醬德腸": 160,
    "辣肉醬脆雞": 160,
    "青醬乳酪雞": 160,
    "塔塔炸蝦": 165,
    "油條麻辣豬": 150
  },

  set : {
    "單點":0,
    "薯條(奶焗醬)": 100,
    "薯條(番茄醬)": 100,
    "格子薯(奶焗醬)": 120,
    "格子薯(番茄醬)": 120,
    "冷麵沙拉": 100,
    "素食冷麵沙拉": 100
  },

  setdrink : {
    "可樂":0,
    "茶廠紅茶": 0,
    "煉乳紅茶": 10,
    "鮮奶茶": 30,
    "冷萃咖啡": 30,
    "咖啡牛奶": 55,
    "蜂蜜檸檬": 30,
    "蘋果汁" : 30,
    "水果茶蘇打" : 30
  },

  addon: {
  "不加購": 0,
  "手工甜芋球": 30,
  "雞塊": 30
}
 };

function setupDrinkDisplay(container) {
  const setSelect = container.querySelector('.set');
  const drinkSection = container.querySelector('.drink-section');
  const addonSection = container.querySelector('.addon-section');
 
  if (!setSelect) return;

  if (drinkSection) drinkSection.style.display = 'none';
  if (addonSection) addonSection.style.display = 'none';

  setSelect.addEventListener('change', function () {
    const price = parseInt(this.selectedOptions[0].dataset.price || 0);
    if (price >= 100) {
      if (drinkSection) drinkSection.style.display = 'block';
      if (addonSection) addonSection.style.display = 'block';
    } else {
      if (drinkSection) drinkSection.style.display = 'none';
      if (addonSection) addonSection.style.display = 'none';
    }
  });

  // 觸發初始事件，設定初始顯示
  setSelect.dispatchEvent(new Event('change'));
}



function addOrderGroup() {
  const container = document.getElementById('orderContainer');

  const group = document.createElement('div');
  group.className = 'order-group';
 group.innerHTML = `
  <label>主餐：
    <select name="main[]">
      ${Object.keys(menu.main).map(key => `<option value="${key}">${key}</option>`).join('')}
    </select>
  </label>
  <br>
  <label>套餐：
    <select name="set[]" class="set">
      ${Object.entries(menu.set).map(([name, price]) =>
        `<option value="${name}" data-price="${price}">${name}</option>`).join('')}
    </select>
  </label>
  <br>
  <div class="drink-section">
    <label class="label-setdrink">飲料：
      <select name="drink[]" class="setdrink">
        ${Object.entries(menu.setdrink).map(([name, price]) =>
          `<option value="${name}" data-price="${price}">${name}</option>`).join('')}
      </select>
    </label>
  </div>
  <br>
  <div class="addon-section">
    <label class="label-addon">加購：
      <select name="addon[]" class="addon">
        ${Object.entries(menu.addon).map(([name, price]) =>
          `<option value="${name}" data-price="${price}">${name}</option>`).join('')}
      </select>
    </label>
  </div>
  <label>數量：
    <input type="number" name="qty[]" class="qty" min="1" max="500" value="1" required>
  </label>
`;

  container.appendChild(group);

  setupDrinkDisplay(group);
}

document.addEventListener("DOMContentLoaded", function () {
  // 套用顯示飲料邏輯
  document.querySelectorAll('.menu-card').forEach(card => {
    setupDrinkDisplay(card);
  });

  // 設定加入餐點事件
  const addItemButtons = document.querySelectorAll(".add-item");

  addItemButtons.forEach(button => {
    button.addEventListener("click", function () {
      const menuCard = this.closest(".menu-card");

      const mainName = this.dataset.main;
      const basePrice = parseInt(this.dataset.price);

      const setSelect = menuCard.querySelector(".set");
      const setOption = setSelect.value;
      const setPrice = parseInt(setSelect.selectedOptions[0].dataset.price || 0);

      const drinkSelect = menuCard.querySelector(".setdrink");
      const setDrinkOption = drinkSelect.value;
      const drinkPrice = parseInt(drinkSelect.selectedOptions[0].dataset.price || 0);

      const addonSelect = menuCard.querySelector(".addon");
      const setAddon = addonSelect.value;
      const addonPrice = parseInt(addonSelect.selectedOptions[0].dataset.price || 0);

      const qty = parseInt(menuCard.querySelector(".qty").value);
      const totalPrice = (basePrice + setPrice + drinkPrice + addonPrice) * qty;

      // ✅ 顯示加入結果
      alert(`已加入 ${mainName}（${setOption} + ${setDrinkOption} + ${setAddon}）x ${qty}，總共 ${totalPrice} 元`);

      // ✅ 日後可以加入這裡做成購物車顯示用的 DOM 元素
      console.log({
        name: mainName,
        set: setOption,
        drink: setDrinkOption,
        addon: setAddon,
        quantity: qty,
        total: totalPrice
      });
    });
  });
});

