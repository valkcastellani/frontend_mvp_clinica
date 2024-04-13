const abreFechaModal = () => {
  let sessionPaciente = document.getElementById("novoPaciente");
  if (sessionPaciente.classList.contains("modal-visible")) {
    sessionPaciente.classList.remove("modal-visible"); // Remove a classe "modal-visible"
  } else {
    sessionPaciente.classList.add("modal-visible"); // Adiciona a classe "modal-visible"
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um paciente da tabela e do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const removerPaciente = (cpf, nome) => {
  Swal.fire({
    title: "Tem certeza?",
    text: "Você vai excluir o paciente " + nome + " portador do CPF " + cpf + "!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "var(--cor-button-confirm)",
    cancelButtonColor: "var(--cor-button-cancel)",
    confirmButtonText: "Sim, pode apagar!",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      let url = 'http://127.0.0.1:5000/paciente?cpf=' + cpf;
      fetch(url, {
        method: 'delete'
      })
        .then((response) => response.json())
        .then((data) => {
          let linhaTabela = document.getElementById(cpf);
          linhaTabela.remove();
          Swal.fire({
            title: "Excluído!",
            text: data.message,
            icon: "success"
          });
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: data.message,
            icon: 'error'
          })
        });
    }
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/pacientes';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.pacientes.forEach(paciente => insertList(paciente.cpf, paciente.nome,
        paciente.data_nascimento, paciente.telefone, paciente.email,
        paciente.data_insercao))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


// /*
//   --------------------------------------------------------------------------------------
//   Função para colocar um item na lista do servidor via requisição POST
//   --------------------------------------------------------------------------------------
// */
// const postItem = async (inputProduct, inputQuantity, inputPrice) => {
//   const formData = new FormData();
//   formData.append('nome', inputProduct);
//   formData.append('quantidade', inputQuantity);
//   formData.append('valor', inputPrice);

//   let url = 'http://127.0.0.1:5000/produto';
//   fetch(url, {
//     method: 'post',
//     body: formData
//   })
//     .then((response) => response.json())
//     .catch((error) => {
//       console.error('Error:', error);
//     });
// }


/*
  --------------------------------------------------------------------------------------
  Função para criar botões: alterar, excluir e visualizar
  --------------------------------------------------------------------------------------
*/
const insertButtons = (parent, cpf, nome) => {
  let buttonAlterar = document.createElement("button");
  let iconAlterar = document.createElement("i");
  iconAlterar.className = "fa-solid fa-pencil";
  buttonAlterar.className = "button button-table";
  buttonAlterar.appendChild(iconAlterar);
  buttonAlterar.addEventListener("click", () => alterarPaciente(cpf));

  let buttonVisualizar = document.createElement("button");
  let iconVisualizar = document.createElement("i");
  iconVisualizar.className = "fa-solid fa-eye"
  buttonVisualizar.className = "button button-table";
  buttonVisualizar.appendChild(iconVisualizar);
  buttonVisualizar.addEventListener("click", () => consultarPaciente(cpf));

  let buttonExcluir = document.createElement("button");
  let iconExcluir = document.createElement("i");
  iconExcluir.className = "fa-solid fa-trash-can";
  buttonExcluir.className = "button button-table";
  buttonExcluir.appendChild(iconExcluir);
  buttonExcluir.addEventListener("click", () => removerPaciente(cpf, nome));

  parent.appendChild(buttonAlterar);
  parent.appendChild(buttonExcluir);
  parent.appendChild(buttonVisualizar);
}


// /*
//   --------------------------------------------------------------------------------------
//   Função para adicionar um novo item com nome, quantidade e valor
//   --------------------------------------------------------------------------------------
// */
// const newItem = () => {
//   let inputProduct = document.getElementById("newInput").value;
//   let inputQuantity = document.getElementById("newQuantity").value;
//   let inputPrice = document.getElementById("newPrice").value;

//   if (inputProduct === '') {
//     alert("Escreva o nome de um item!");
//   } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
//     alert("Quantidade e valor precisam ser números!");
//   } else {
//     insertList(inputProduct, inputQuantity, inputPrice)
//     postItem(inputProduct, inputQuantity, inputPrice)
//     alert("Item adicionado!")
//   }
// }


/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (cpf, nome, data_nascimento, telefone, email, data_insercao) => {
  const novaDataNascimento = new Date(data_nascimento).toLocaleDateString()
  const novaDataInsercao = new Date(data_insercao).toLocaleString('pt-BR');
  var item = [cpf, nome, novaDataNascimento, telefone, email, novaDataInsercao]
  var table = document.getElementById('tabelaPacientes');
  var row = table.insertRow();
  row.id = cpf

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButtons(row.insertCell(-1), cpf, nome)
}