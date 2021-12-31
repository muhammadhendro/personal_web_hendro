let blogs = [];
let month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Desember",
];
function addBlog(event) {
  event.preventDefault();

  

  let title = document.getElementById("input-blog-title").value;
  let content = document.getElementById("input-blog-content").value;
  let image = document.getElementById("input-blog-image");
  image = URL.createObjectURL(image.files[0]);

  if (!title || !content  ) {
    return alert('Title, content dan image harus diisi!');
  }
  
  let blog = {
    title,
    content,
    image,
    author: "Muhammad Hendro",
    postAt: new Date(),
  };

  blogs.push(blog);
  renderBlog();
}

function renderBlog() {
  let contentContainer = document.getElementById("contents");
  contentContainer.innerHTML = "";
  for (let i = 0; i < blogs.length; i++) {
    contentContainer.innerHTML += `<div class="blog-list-item">
        <div class="blog-image">
          <img src=" ${blogs[i].image}" alt="" />
        </div>
        <div class="blog-content">
          <div class="btn-group">
            <button class="btn-edit">Edit Post</button>
            <button class="btn-post">Post Blog</button>
          </div>
          <h1>
            <a href="blog-detail.html" target="_blank"
              > ${blogs[i].title}</a
            >
          </h1>
          <div class="detail-blog-content">
          ${getFullTime(blogs[i].postAt)} | by ${blogs[i].author}
          </div>
          <p>
            ${blogs[i].content}
          </p>
          <a href=""><p>
            Read More > 
            </p></a>
          <div style="text-align: right; font-size: 15px; color: grey;">
          ${getDistanceTime(blogs[i].postAt)}
            </div>
        </div>
      </div>`;
  }
}

function getFullTime(time) {
  let date = time.getDate();
  let monthIndex = time.getMonth();
  let year = time.getFullYear();
  let hour = time.getHours();
  let minute = time.getMinutes();

  let fullTime = `${date} ${month[monthIndex]} ${year} ${hour}:${minute} WIB`;
  return fullTime;
}

function getDistanceTime(time) {
 
  let timeNow = new Date();
  let distance = timeNow - time;

  // convert to day => ms in 1d
  let miliseconds = 1000; // 1ms in 1s
  let secondInHours = 3600; //1ms in 1h
  let hoursInDay = 23; // hours in 1d
  let daysInMonth = 30;
  let monthInYear = 12;

  // convert to year
  let distanceYear = Math.floor(
    distance /
      (miliseconds * secondInHours * hoursInDay * daysInMonth * monthInYear)
  );
  if (distanceYear >= 1) {
    return `${distanceYear} year ago`
  } else {
    // convert to month
    let distanceMonth = Math.floor(
      distance / (miliseconds * secondInHours * hoursInDay * daysInMonth)
    );

    if (distanceMonth >= 1) {
      return `${distanceMonth} month ago`
    } else {
      // convert to day
      let distanceDay = Math.floor(
        distance / (miliseconds * secondInHours * hoursInDay)
      );
      if (distanceDay >= 1) {
        return `${distanceDay} day ago`
      } else {
        // convert to hour
        let distanceHours = Math.floor(distance / (miliseconds * 60 * 60));
        if (distanceHours >= 1) {
          return `${distanceHours} hours ago`
        } else {
          // convert to minute
          let distanceMinutes = Math.floor(distance / (miliseconds * 60));
          if (distanceMinutes >= 1) {
            return`${distanceMinutes} minutes ago`
          } else {
            let distanceSeconds = Math.floor(distance / miliseconds);
            return `${distanceSeconds} seconds ago`
          }
        }
      }
    }
  }
}

// setInterval(()=>{

//   renderBlog()

// },1000)
