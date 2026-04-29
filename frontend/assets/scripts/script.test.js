// script.test.js
document.body.innerHTML = `
  <div id="cakeNameDisplay"></div>
  <div id="timerDisplay"></div>
  <img id="cakeImage">
  <div class="history-table-container"><table><tbody id="historyList"></tbody></table></div>
  <button id="startButton"></button>
  <audio id="notificationSound"></audio>
  <div id="cakeDonePopup" style="display: none;"></div>
  <input id="customTime">
  <input id="customCakeName">
`;

const { selectCake, setCustomTime, startTimer, showHistory, closePopup, Timer, BakingHistory } = require('./script.js');

describe('Baking Focus Timer Unit Tests', () => {
  let bakingHistory, timer;

  beforeEach(() => {
    // Reset localStorage và DOM trước mỗi test
    localStorage.clear();
    bakingHistory = new BakingHistory();
    timer = new Timer(bakingHistory);
    // document.getElementById('cakeDonePopup').style.display = 'none';
    window.alert = jest.fn();
  });

  test('selectCake should display cake name and time', () => {
    selectCake('Cookie', 60);
    expect(document.getElementById('cakeNameDisplay').textContent).toBe('Cookie');
    expect(document.getElementById('timerDisplay').textContent).toBe('60:00');
    // expect(document.getElementById('cakeImage').src).toBe('assets/images/cookie.png');
  });

  // WT02: Kiểm tra vòng lặp đếm ngược trong startTimer()
  test('startTimer should count down from 10 seconds', () => {
    selectCake('Cookie', 1); // 1 phút = 60 giây
    jest.useFakeTimers();
    startTimer();
    jest.advanceTimersByTime(59000); // Chạy 59 giây
    expect(document.getElementById('timerDisplay').textContent).toBe('00:01');
    jest.advanceTimersByTime(1000); // Chạy 1 giây cuối
    expect(document.getElementById('timerDisplay').textContent).toBe('00:00');
    // expect(document.getElementById('cakeDonePopup').style.display).toBe('flex');
    // expect(document.getElementById('cakeImage').src).toContain('cookie-after.png');
    jest.clearAllTimers();
  });

  // WT03: Kiểm tra lưu lịch sử trong saveHistory()
  test('saveHistory should save entry to localStorage', () => {
    // selectCake('Cookie', 1); // Thiết lập cake và time (1 phút = 60 giây)
    // jest.useFakeTimers(); // Mock timers trước khi start
    // timer.start();
    // jest.advanceTimersByTime(60000); // Chạy hết 60 giây
    // const history = bakingHistory.retrieve();
    // expect(history.length).toBe(1);
    // expect(history[0].cakeName).toBe('Cookie');
    // jest.clearAllTimers();
    // Thiết lập trạng thái cho Timer
    const entry = { cakeName: 'Cookie', time: 60, completedAt: Date.now() }
    selectCake('Strawberry cake', 1); // Gán cake và time
    timer.completedAt = new Date(); // Gán completedAt
    jest.useFakeTimers();
    timer.start();
    jest.advanceTimersByTime(59000); // Gọi hàm saveToHistory của Timer
    timer.saveToHistory();
    // Kiểm tra dữ liệu trong localStorage
    const history = JSON.parse(localStorage.getItem('bakingHistory'));
    expect(history).toContainEqual(entry);
  });

  // WT04: Kiểm tra hàm showHistory()
  test('showHistory should toggle show class', () => {
    showHistory();
    expect(document.querySelector('.history-table-container').classList.contains('show')).toBe(true);
    showHistory();
    expect(document.querySelector('.history-table-container').classList.contains('show')).toBe(false);
  });

  // WT05: Kiểm tra điều kiện lỗi trong startTimer()
  test('startTimer with negative time should show alert', () => {
    // window.alert = jest.fn(); // Mock alert
    document.getElementById('customCakeName').value = 'Custom Cake';
    document.getElementById('customTime').value = '-5';
    setCustomTime();
    expect(window.alert).toHaveBeenCalledWith('Invalid time input. Please enter a positive number.');
  });
});