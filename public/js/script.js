let selectedVocabIndex = null

const loadingIn = () => {
  const loader = `
  <div class="d-flex justify-content-center mb-4">
    <div class="spinner-grow text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`
  document.getElementById('vocab-lists').innerHTML = loader
}

const loadingOut = () => {
  document.getElementById('vocab-lists').innerHTML = ''
}

const getAllVocabs = async () => {
  loadingIn()

  const res = await fetch('/api')
  const { vocabs } = await res.json()

  loadingOut()

  return vocabs
}

const buildLists = (allVocabs) => {
  const vocabListsEl = document.getElementById('vocab-lists')

  allVocabs.forEach((vocab, vocabIndex) => {
    const li = document.createElement('li')
    li.textContent = vocab
    li.style.cursor = 'pointer'
    li.classList.add('list-group-item', 'list-group-item-action', 'fs-5')
    li.addEventListener('click', () => {
      showModal(vocab, vocabIndex)
    })
    vocabListsEl.appendChild(li)
  })
}

const refreshData = async () => {
  const vocabListsEl = document.getElementById('vocab-lists')
  vocabListsEl.innerHTML = ''
  const allVocabs = await getAllVocabs()
  buildLists(allVocabs)
}

const addNewVocab = async (vocab) => {
  await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newVocab: vocab,
    }),
  })
  await refreshData()
}

const deleteVocab = async () => {
  if (selectedVocabIndex === null) return
  await fetch('/api', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      selectedVocabIndex,
    }),
  })
  await refreshData()
}

const updateVocab = async () => {
  const editInputEl = document.getElementById('editInput')

  await fetch('/api', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      editedVocab: editInputEl.value,
      vocabIndex: selectedVocabIndex,
    }),
  })
  await refreshData()
}

const showModal = (vocab, vocabIndex) => {
  const modalEl = new bootstrap.Modal(document.getElementById('modal'))
  const editInputEl = document.getElementById('editInput')
  editInputEl.value = vocab

  selectedVocabIndex = vocabIndex

  modalEl.show()
}

const run = async () => {
  const allVocabs = await getAllVocabs()
  const inputEl = document.getElementById('input')
  const addBtnEl = document.getElementById('addBtn')

  buildLists(allVocabs)

  addBtnEl.addEventListener('click', async () => {
    if (!inputEl.value) return
    await addNewVocab(inputEl.value)
    inputEl.value = ''
  })
}

run()
