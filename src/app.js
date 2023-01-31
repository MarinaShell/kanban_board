import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");

generateTestUser(User);

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  let fieldHTMLContent = authUser(login, password)
    ? taskFieldTemplate
    : noAccessTemplate;

  document.querySelector("#content").innerHTML = fieldHTMLContent;
});

/* Когда пользователь нажимает на кнопку,
переключение между скрытием и отображением раскрывающегося содержимого */
let arr_backlog=["4", "8", "10"];
let arr_ready=["1","2","3","4"];
let arr_inprogress=["5", "6", "7"];
let arr_finished=[];
const ul_task_backlog = document.querySelector(".ul-task-backlog");
const ul_task_ready = document.querySelector(".ul-task-ready");
const ul_task_inprogress = document.querySelector(".ul-task-inprogress");
const ul_task_finished = document.querySelector(".ul-task-finished");

/*при старте страницы заполняем карточки из localstorage*/ 
window.onload = function()
{
  onInit();
};

/*функция заполнения карточки из localstorage*/ 
const onInit = () => {
  clearList(ul_task_backlog);
  fullList(ul_task_backlog, arr_backlog);

  clearList(ul_task_ready);
  fullList(ul_task_ready, arr_ready);

  clearList(ul_task_inprogress);
  fullList(ul_task_inprogress, arr_inprogress);
  
  clearList(ul_task_finished);
  fullList(ul_task_finished, arr_finished);
};

/*очищаем список*/
function clearList(my_ul){
  while (my_ul.firstChild) {
    my_ul.removeChild(my_ul.firstChild);
  }
};

/*заполняем список*/
function fullList(my_ul, arr ){
  for (let i = 0; i< arr.length; i++)
  {
      const newLi = document.createElement('li');
      newLi.className = 'li'; 
      newLi.textContent = arr[i];
      my_ul.appendChild(newLi);      
  }                 
};

/*заполняем список*/
function fullList_ul(my_ul, arr, my_ul_list, arr_list ){
  for (let i = 0; i< arr.length; i++)
  {
      const newLi = document.createElement('li');
      newLi.className = 'li';
      const newButton = document.createElement('button');
      newButton.type = 'button';
      newButton.textContent = arr[i];
      newButton.className = 'btn-list';
      newButton.onclick = ()=>{
        arr_list.push(arr[i]);
        arr.splice(i, 1);
        clearList(my_ul_list);
        fullList(my_ul_list, arr_list);
        onInit();
      }
      newLi.appendChild(newButton);
      my_ul.appendChild(newLi);      
  }                 
};

window.addNewCard = function(my_ul, arr_list){
}

function saveCard(user) {
  try {
    addToStorage(user, user.storageKey);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

/*нажимаем на кнопку add card у Backlog*/
window.myFunction_backlog = function() {   
    clearList(ul_task_backlog);
    arr_backlog.push("new");
    fullList(ul_task_backlog, arr_backlog);  
};
 
/*нажимаем на кнопку add card у Ready*/
window.myFunction_ready = function() {    
    document.getElementById("myDropdown-ready").classList.toggle("show");
    let ul_ready = document.querySelector(".ul-ready");
    clearList(ul_ready);
    fullList_ul(ul_ready, arr_backlog, ul_task_ready, arr_ready);      
};
 
/*нажимаем на кнопку add card у In Progress*/
window.myFunction_inprogress = function() {    
    document.getElementById("myDropdown-inprogress").classList.toggle("show");
    let ul_progress = document.querySelector(".ul-progress");
    clearList(ul_progress);
    fullList_ul(ul_progress, arr_ready, ul_task_inprogress, arr_inprogress);           
};

/*нажимаем на кнопку add card у Finished*/
window.myFunction_finished = function() { 
    document.getElementById("myDropdown-finished").classList.toggle("show");
    let ul_finished = document.querySelector(".ul-finished");
    clearList(ul_finished);
    fullList_ul(ul_finished, arr_inprogress, ul_task_finished,arr_finished);           
};
 
// Закройте выпадающее меню, если пользователь щелкает за его пределами
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
  
    var dropdowns = document.getElementsByClassName("dropdown-content");    
    
    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};
 