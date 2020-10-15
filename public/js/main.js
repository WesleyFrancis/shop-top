// const app ={

//     init()
//     {
//         const bigImg =document.querySelector("#BigImage > img")
//         const prod = document.querySelectorAll(".productContainer");
//         const newItemList = document.querySelector("#newItemList");


//         const increase = document.querySelector("#increase");
//         const decrease = document.querySelector("#decrease");
//         const quantinput = document.querySelector("#quantity");
//         let currentVal = 0;
//         increase.addEventListener("click",()=>{
//             if(quantinput.value==null||quantinput.value == "")
//             {
//                 quantinput.value = 0;
//             }
//             currentVal = parseInt(quantinput.value);
//             currentVal+=1;
//             quantinput.value = `${currentVal}`;
//         });

//         decrease.addEventListener("click",()=>{
//             if(quantinput.value==null||quantinput.value == "")
//             {
//                 quantinput.value = 0;
//             }
//             currentVal = parseInt(quantinput.value);
//             currentVal-=1;
//             if(currentVal<=0)
//             {
//                 currentVal=1;
//             }
//             quantinput.value = `${currentVal}`;

//         })
//     }

// }

// app.init();
// export default app;