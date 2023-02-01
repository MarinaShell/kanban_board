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

let arr_backlog=["4", "8", "10"];
let arr_ready=["1","2","3","4"];
let arr_inprogress=["5", "6", "7"];
let arr_finished=[];
const ul_task_backlog = document.querySelector(".ul-task-backlog");
const ul_task_ready = document.querySelector(".ul-task-ready");
const ul_task_inprogress = document.querySelector(".ul-task-inprogress");
const ul_task_finished = document.querySelector(".ul-task-finished");
const btn_backlog = document.querySelector("#btn-backlog");
const btn_ready = document.querySelector("#btn-ready");
const btn_inprogress = document.querySelector("#btn-inprogress");
const btn_finished = document.querySelector("#btn-finished");
const btn_task_submit = document.querySelector(".btn-task_submit");
const p_task_active = document.querySelector(".task-footer__active");
const p_task_finished = document.querySelector(".task-footer__finished");
const p_backlog_add_task = document.querySelector(".input_add_task");
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
  
  setButtonStyle(btn_ready, arr_backlog);
  setButtonStyle(btn_inprogress, arr_ready);
  setButtonStyle(btn_finished, arr_inprogress);

  fullActiveFinishedTasks();
};
 
/*устанавливаем для конпки значения disable*/
function setButtonStyle(btn, arr){
  if (arr.length == 0)
    btn.className = 'dropbtn_disable';
  else
    btn.className = 'dropbtn';
}
 
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
 
function fullActiveFinishedTasks(){
  p_task_active.textContent = "Active tasks: " + arr_backlog.length;
  p_task_finished.textContent = "Finished tasks: " + arr_finished.length;
}

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
 
function saveCard(user) {
  try {
    addToStorage(user, user.storageKey);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};
 
/*нажимаем на кнопку add card у Backlog*/
window.myFunction_backlog = function(){   
    btn_backlog.className =  'hide';
    btn_task_submit.className = 'show btn-task_submit';
    p_backlog_add_task.className = 'show input_add_task font-task';
};

window.submit_task = function(){
  clearList(ul_task_backlog);
  arr_backlog.push(p_backlog_add_task.innerHTML);
  fullList(ul_task_backlog, arr_backlog);  
  onInit();
  btn_backlog.className = 'show dropbtn';
  btn_task_submit.className = 'hide';
  p_backlog_add_task.className = 'hide';
}
 
/*нажимаем на кнопку add card у Ready*/
window.myFunction_ready = function() {    
    document.getElementById("myDropdown-ready").classList.toggle("show");
    let ul_ready = document.querySelector(".ul-ready");
    clearList(ul_ready);
    fullList_ul(ul_ready, arr_backlog, ul_task_ready, arr_ready);      
};
 
/*нажимаем на кнопку add card у In Progress*/
window.myFunction_inprogress = function (){    
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