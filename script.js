document.addEventListener('DOMContentLoaded', function () {
  // 从 localStorage 中加载日记数据
  let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

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
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
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
    const entry = { id: Date.now(), date: date, content: content };
    diaryEntries.push(entry);
    saveEntries();
    renderEntries();
    entryContent.value = '';
  });

  // 五年回顾功能：当选择回顾日期时，显示该日期（月-日）连续五年的日记
  reviewDateInput.addEventListener('change', function () {
    const reviewDate = reviewDateInput.value;
    if (!reviewDate) return;
    const selected = new Date(reviewDate);
    const month = selected.getMonth() + 1; // 月份：0-11转换为1-12
    const day = selected.getDate();
    // 以所选日期的年份为基准，连续往前推 5 年（含当前年份）
    const baseYear = selected.getFullYear();

    reviewResults.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const year = baseYear - i;
      // 构造完整日期字符串（格式：YYYY-MM-DD）
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      // 过滤出该日期对应的日记
      const entriesForDate = diaryEntries.filter(entry => entry.date === formattedDate);
      
      // 创建一个展示块
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

  // 初始渲染所有日记记录
  renderEntries();
});
