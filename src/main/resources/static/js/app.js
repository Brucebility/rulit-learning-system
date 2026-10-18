/* Rulit 智能学习辅助系统 —— 管理后台逻辑 */
(() => {
  'use strict';

  const API = {
    dept: {
      list: () => GET('/depts'),
      get: (id) => GET(`/depts/${id}`),
      save: (body) => SEND('POST', '/depts', body),
      update: (body) => SEND('PUT', '/depts', body),
      remove: (id) => SEND('DELETE', `/depts?id=${id}`),
    },
    emp: {
      page: (params) => GET('/emps?' + new URLSearchParams(params).toString()),
      save: (body) => SEND('POST', '/emps', body),
    },
    upload: (file) => {
      const fd = new FormData();
      fd.append('file', file);
      return fetch('/upload', { method: 'POST', body: fd }).then(handle);
    },
  };

  /* ==================== 请求封装 ==================== */
  function handle(res) {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json().then((json) => {
      if (json.code !== 1) throw new Error(json.msg || '请求失败');
      return json.data;
    });
  }
  function GET(url) {
    return fetch(url).then(handle);
  }
  function SEND(method, url, body) {
    return fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then(handle);
  }

  /* ==================== 通用 ==================== */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
  }

  function fmtDateTime(v) {
    if (!v) return '—';
    return String(v).replace('T', ' ').slice(0, 19);
  }
  function fmtDate(v) {
    if (!v) return '—';
    return String(v).slice(0, 10);
  }
  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  const JOB_MAP = { 1: '班主任', 2: '讲师', 3: '学工主管', 4: '教研主管', 5: '咨询师' };
  const GENDER_MAP = { 1: '男', 2: '女' };

  /* ==================== 视图切换 ==================== */
  const views = { dept: initDeptView, emp: initEmpView, upload: initUploadView };
  const initialized = new Set();

  function switchView(view) {
    $$('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
    $$('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
    if (!initialized.has(view) && views[view]) {
      initialized.add(view);
      views[view]();
    }
  }

  $$('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  /* ==================== 部门管理 ==================== */
  let deptCache = [];
  let editingDeptId = null;

  async function initDeptView() {
    $('#dept-add').addEventListener('click', () => openDeptModal(null));
    $('#dept-save').addEventListener('click', saveDept);
    $('#dept-name').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveDept(); });
    await loadDepts();
  }

  async function loadDepts() {
    try {
      deptCache = await API.dept.list();
      renderDepts();
    } catch (e) {
      $('#dept-tbody').innerHTML = `<tr><td colspan="5" class="empty">加载失败：${escapeHtml(e.message)}</td></tr>`;
    }
  }

  function renderDepts() {
    const tbody = $('#dept-tbody');
    if (!deptCache.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">暂无部门，点击右上角新增</td></tr>';
      return;
    }
    tbody.innerHTML = deptCache.map((d) => `
      <tr>
        <td>${d.id}</td>
        <td>${escapeHtml(d.name)}</td>
        <td>${fmtDateTime(d.createTime)}</td>
        <td>${fmtDateTime(d.updateTime)}</td>
        <td>
          <button class="link-btn" data-edit="${d.id}">编辑</button>
          <button class="link-btn danger" data-del="${d.id}">删除</button>
        </td>
      </tr>`).join('');

    tbody.querySelectorAll('[data-edit]').forEach((b) => {
      b.addEventListener('click', () => {
        const dept = deptCache.find((x) => String(x.id) === b.dataset.edit);
        openDeptModal(dept);
      });
    });
    tbody.querySelectorAll('[data-del]').forEach((b) => {
      b.addEventListener('click', async () => {
        const dept = deptCache.find((x) => String(x.id) === b.dataset.del);
        if (!confirm(`确定删除部门「${dept.name}」？`)) return;
        try {
          await API.dept.remove(dept.id);
          toast('删除成功');
          await loadDepts();
        } catch (e) {
          toast('删除失败：' + e.message);
        }
      });
    });
  }

  function openDeptModal(dept) {
    editingDeptId = dept ? dept.id : null;
    $('#dept-modal-title').textContent = dept ? '编辑部门' : '新增部门';
    $('#dept-name').value = dept ? dept.name : '';
    $('#dept-modal').hidden = false;
    $('#dept-name').focus();
  }

  async function saveDept() {
    const name = $('#dept-name').value.trim();
    if (!name) { toast('请输入部门名称'); return; }
    try {
      if (editingDeptId === null) {
        await API.dept.save({ name });
      } else {
        await API.dept.update({ id: editingDeptId, name });
      }
      $('#dept-modal').hidden = true;
      toast('保存成功');
      await loadDepts();
    } catch (e) {
      toast('保存失败：' + e.message);
    }
  }

  /* ==================== 员工管理 ==================== */
  const empState = { page: 1, pageSize: 10, total: 0, depts: [] };

  async function initEmpView() {
    $('#emp-add').addEventListener('click', openEmpModal);
    $('#emp-save').addEventListener('click', saveEmp);
    $('#emp-filter').addEventListener('submit', (e) => {
      e.preventDefault();
      empState.page = 1;
      loadEmps();
    });
    $('#emp-reset').addEventListener('click', () => {
      setTimeout(() => { empState.page = 1; loadEmps(); }, 0);
    });
    $('#emp-prev').addEventListener('click', () => {
      if (empState.page > 1) { empState.page -= 1; loadEmps(); }
    });
    $('#emp-next').addEventListener('click', () => {
      const maxPage = Math.max(1, Math.ceil(empState.total / empState.pageSize));
      if (empState.page < maxPage) { empState.page += 1; loadEmps(); }
    });
    $('#emp-size').addEventListener('change', (e) => {
      empState.pageSize = Number(e.target.value);
      empState.page = 1;
      loadEmps();
    });

    try {
      empState.depts = await API.dept.list();
    } catch (_) { /* 部门下拉失败不影响列表 */ }

    await loadEmps();
  }

  function filterParams() {
    const form = $('#emp-filter');
    const data = new FormData(form);
    const params = { page: empState.page, pageSize: empState.pageSize };
    for (const [k, v] of data.entries()) {
      if (v !== '' && v !== null) params[k] = v;
    }
    return params;
  }

  async function loadEmps() {
    const tbody = $('#emp-tbody');
    tbody.innerHTML = '<tr><td colspan="8" class="empty">加载中…</td></tr>';
    try {
      const data = await API.emp.page(filterParams());
      empState.total = data.total ?? 0;
      renderEmps(data.rows || []);
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="8" class="empty">加载失败：${escapeHtml(e.message)}</td></tr>`;
    }
    const maxPage = Math.max(1, Math.ceil(empState.total / empState.pageSize));
    $('#emp-total').textContent = `共 ${empState.total} 条`;
    $('#emp-page').textContent = `${empState.page} / ${maxPage}`;
    $('#emp-prev').disabled = empState.page <= 1;
    $('#emp-next').disabled = empState.page >= maxPage;
  }

  function renderEmps(rows) {
    const tbody = $('#emp-tbody');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty">没有符合条件的员工</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map((e) => `
      <tr>
        <td>${e.id}</td>
        <td>${escapeHtml(e.username)}</td>
        <td>${escapeHtml(e.name)}</td>
        <td>${GENDER_MAP[e.gender] || '—'}</td>
        <td>${JOB_MAP[e.job] || '—'}</td>
        <td>${escapeHtml(e.deptName || '—')}</td>
        <td>${fmtDate(e.entryDate)}</td>
        <td>${e.salary == null ? '—' : '¥' + e.salary}</td>
      </tr>`).join('');
  }

  function openEmpModal() {
    $('#emp-username').value = '';
    $('#emp-name').value = '';
    $('#emp-gender').value = '1';
    $('#emp-phone').value = '';
    $('#emp-job').value = '1';
    $('#emp-entry').value = '';
    $('#emp-salary').value = '';

    const sel = $('#emp-dept');
    sel.innerHTML = '<option value="">请选择部门</option>' +
      empState.depts.map((d) => `<option value="${d.id}">${escapeHtml(d.name)}</option>`).join('');

    $('#emp-modal').hidden = false;
    $('#emp-username').focus();
  }

  async function saveEmp() {
    const body = {
      username: $('#emp-username').value.trim(),
      name: $('#emp-name').value.trim(),
      gender: Number($('#emp-gender').value),
      phone: $('#emp-phone').value.trim(),
      job: Number($('#emp-job').value),
      deptId: $('#emp-dept').value ? Number($('#emp-dept').value) : null,
      entryDate: $('#emp-entry').value || null,
      salary: $('#emp-salary').value ? Number($('#emp-salary').value) : null,
    };
    if (!body.username || !body.name) { toast('用户名和姓名必填'); return; }
    try {
      await API.emp.save(body);
      $('#emp-modal').hidden = true;
      toast('新增员工成功');
      await loadEmps();
    } catch (e) {
      toast('保存失败：' + e.message);
    }
  }

  /* ==================== 文件上传 ==================== */
  function initUploadView() {
    const zone = $('#dropzone');
    const input = $('#file-input');

    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      if (input.files[0]) doUpload(input.files[0]);
      input.value = '';
    });
    ['dragenter', 'dragover'].forEach((ev) => zone.addEventListener(ev, (e) => {
      e.preventDefault(); zone.classList.add('dragover');
    }));
    ['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, (e) => {
      e.preventDefault(); zone.classList.remove('dragover');
    }));
    zone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file) doUpload(file);
    });
  }

  async function doUpload(file) {
    toast(`正在上传：${file.name}`);
    try {
      const url = await API.upload(file);
      const result = $('#upload-result');
      const link = $('#upload-url');
      link.textContent = url;
      link.href = url;
      result.hidden = false;
      toast('上传成功');
    } catch (e) {
      toast('上传失败：' + e.message + '（需先配置阿里云 OSS）');
    }
  }

  /* ==================== 弹窗关闭 ==================== */
  $$('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => { $('#' + btn.dataset.close).hidden = true; });
  });
  $$('.modal').forEach((m) => {
    m.addEventListener('click', (e) => { if (e.target === m) m.hidden = true; });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') $$('.modal').forEach((m) => { m.hidden = true; });
  });

  /* ==================== 启动 ==================== */
  // 支持 /#emp、/#upload 直达某个视图
  const hashView = location.hash.replace('#', '');
  if (views[hashView]) {
    switchView(hashView);
  } else {
    initialized.add('dept');
    initDeptView();
  }
})();
