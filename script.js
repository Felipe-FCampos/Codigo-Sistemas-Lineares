let matrix = []
let original = []

function generateMatrix() {
  const n = parseInt(document.getElementById("size").value)
  const container = document.getElementById("matrix-input")
  container.innerHTML = ""

  const table = document.createElement("table")

  for (let i = 0; i < n; i++) {
    const row = document.createElement("tr")
    for (let j = 0; j <= n; j++) {
      const cell = document.createElement("td")
      const input = document.createElement("input")
      input.type = "number"
      input.id = `a_${i}_${j}`
      input.placeholder = j === n ? "b" : `a${i + 1}${j + 1}`
      cell.appendChild(input)
      row.appendChild(cell)
    }
    table.appendChild(row)
  }

  container.appendChild(table)
}

function readMatrix() {
  const n = parseInt(document.getElementById("size").value)
  matrix = []
  original = []

  for (let i = 0; i < n; i++) {
    const row = []
    const originalRow = []
    for (let j = 0; j <= n; j++) {
      const val = parseFloat(document.getElementById(`a_${i}_${j}`).value.replace(",", "."))
      row.push(val)
      originalRow.push(val)
    }
    matrix.push(row)
    original.push(originalRow)
  }
}

function printMatrix(mat, title, targetId) {
  let html = `<h3>${title}</h3><pre>`
  mat.forEach(row => {
    html += row.map(n => String(n.toFixed(2)).padStart(8)).join(" ") + "\n"
  })
  html += "</pre>"
  document.getElementById(targetId).innerHTML = html
}

function solveSystem() {
  readMatrix()
  const n = matrix.length
  printMatrix(original, "Sistema Original:", "original-system")

  // Escalonamento
  for (let i = 0; i < n; i++) {
    // Pivô nulo? Tentar trocar
    if (matrix[i][i] === 0) {
      let swapped = false
      for (let k = i + 1; k < n; k++) {
        if (matrix[k][i] !== 0) {
          [matrix[i], matrix[k]] = [matrix[k], matrix[i]]
          swapped = true
          break
        }
      }
      if (!swapped) continue
    }

    // Normaliza linha
    const pivot = matrix[i][i]
    for (let j = 0; j <= n; j++) {
      matrix[i][j] /= pivot
    }

    // Zera abaixo e acima
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = matrix[k][i]
        for (let j = 0; j <= n; j++) {
          matrix[k][j] -= factor * matrix[i][j]
        }
      }
    }
  }

  printMatrix(matrix, "Sistema Escalonado:", "escalonado")

  // Verificação
  let status = "ÚNICA"
  for (let i = 0; i < n; i++) {
    const row = matrix[i]
    const allZero = row.slice(0, n).every(v => Math.abs(v) < 1e-8)
    const independent = Math.abs(row[n]) >= 1e-8
    if (allZero && independent) {
      status = "IMPOSSÍVEL"
      break
    } else if (allZero && !independent) {
      status = "INFINITAS"
    }
  }

  const solutionDiv = document.getElementById("solution")
  if (status === "IMPOSSÍVEL") {
    solutionDiv.innerHTML = "<h3>Sistema Impossível (sem solução)</h3>"
  } else if (status === "INFINITAS") {
    solutionDiv.innerHTML = "<h3>Sistema Possui Infinitas Soluções (SPI)</h3>"
  } else {
    let result = "<h3>Solução:</h3><ul>"
    for (let i = 0; i < n; i++) {
      result += `<li>x${i + 1} = ${matrix[i][n].toFixed(4)}</li>`
    }
    result += "</ul>"
    solutionDiv.innerHTML = result
  }
}

function limparTela() {
    const n = parseInt(document.getElementById("size").value)
  
    // Limpa todos os inputs da matriz
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= n; j++) {
        const input = document.getElementById(`a_${i}_${j}`)
        if (input) input.value = ""
      }
    }
  
    // Limpa as divs de exibição
    document.getElementById("original-system").innerHTML = ""
    document.getElementById("escalonado").innerHTML = ""
    document.getElementById("solution").innerHTML = ""
  }
