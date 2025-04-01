document.addEventListener('DOMContentLoaded', function () {
  // 尝试从 localStorage 中加载日记数据
  let diaryEntries = [];
  try {
    diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
  } catch (e) {
    console.error("加载日记数据失败：", e);
    diaryEntries = [];
  }

  const entryDateInput = document.getElementById('entry-date');
  const entryContent = document.getElementById('entry-content');
  const addEntryBtn = document.getElementById('add-entry-btn');
  const entriesList = document.getElementById('entries-list');
  const reviewDateInput = document.getElementById('review-date');
  const reviewResults = document.getElementById('review-results');

  // 默认录入日记日期为今天
  entryDateInput.value = new Date().toISOString().substr(0, 10);

  // 保存数据到 localStorage
  function saveEntries() {
    try {
      localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
      console.log("保存成功！", diaryEntries);
    } catch (e) {
      console.error("保存日记失败：", e);
    }
  }

  // 渲染所有日记记录
  function renderEntries() {
    entriesList.innerHTML = '';
    // 按日期降序排序
    diaryEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    diaryEntries.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.date}: ${entry.content}`;
      entriesList.appendChild(li);
    });
  }

  // 添加日记事件
  addEntryBtn.addEventListener('click', function () {
    const date = entryDateInput.value;
    const content = entryContent.value.trim();
    if (!date || content === '') {
      alert('请填写日期和内容');
      return;
    }
    // 构造新日记对象
    const entry = { id: Date.now(), date: date, content: content };
    diaryEntries.push(entry);
    saveEntries();
    renderEntries();
    entryContent.value = '';
  });

  // 五年回顾功能
  reviewDateInput.addEventListener('change', function () {
    const reviewDate = reviewDateInput.value;
    if (!reviewDate) return;
    const selected = new Date(reviewDate);
    const month = selected.getMonth() + 1;
    const day = selected.getDate();
    const baseYear = selected.getFullYear();

    reviewResults.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const year = baseYear - i;
      // 格式化日期字符串（确保月份和日期为两位数）
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const entriesForDate = diaryEntries.filter(entry => entry.date === formattedDate);

      const container = document.createElement('div');
      container.className = 'review-year';
      const header = document.createElement('h3');
      header.textContent = formattedDate;
      container.appendChild(header);
      
      if (entriesForDate.length > 0) {
        const ul = document.createElement('ul');
        entriesForDate.forEach(entry => {
          const li = document.createElement('li');
          li.textContent = entry.content;
          ul.appendChild(li);
        });
        container.appendChild(ul);
      } else {
        const p = document.createElement('p');
        p.textContent = '无记录';
        container.appendChild(p);
      }
      reviewResults.appendChild(container);
    }
  });

  // 初始渲染日记列表
  renderEntries();
});
