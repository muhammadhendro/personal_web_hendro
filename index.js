const express = require("express");
const app = express();
const port = 5000;

const db = require("./connection/db");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
const upload = require('./middlewares/uploadFile')

let blogs = [
  {
    title: "Pasar Coding di Indonesia Dinilai Masih Menjanjikan",
    post_at: "12 Jul 2021 22:30 WIB",
    author: "Ichsan Emrald Alamsyah",
    content:
      "Ketimpangan sumber daya manusia (SDM) di sektor digital masih menjadi isu yang belum terpecahkan. Berdasarkan penelitian ",
  },
];
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

app.set("view engine", "hbs");

app.use("/public", express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.urlencoded({ extended: false }));

app.use(flash());

app.use(
  session({
    cookie: {
      maxAge: 2 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secretValue",
  })
);

app.get("/", (req, res) => {
  db.connect((err, client, done) => {
    if (err) throw err;

    client.query("SELECT * FROM tb_project", (err, result) => {
      done();
      let data = result.rows;

      //let date = post_ago.getDate();
      
      res.render("index", {
        isLogin: req.session.isLogin,
        blogs: data,
        user: req.session.user,
        title: "Home",
      });
    });
  });
});

app.get("/add-blog", (req, res) => {
  res.render("add-blog", { title: "Add New Blog", isLogin: req.session.isLogin, user: req.session.user, });
});

app.get("/blog", (req, res) => {
  // let dataBlogs = blogs.map((data) => {
  //   return { ...data, isLogin };
  // });



  query = `SELECT tb_blog.id, title, content, image, name AS author,author_id, post_date
	FROM public.tb_blog LEFT JOIN tb_user
	ON tb_blog.author_id = tb_user.id`
  db.connect((err, client, done) => {
    if (err) throw err;

    client.query(query, (err, result) => {
      done();
      let data = result.rows;
      let newData = data.map((d) => {
        return {
          ...d,
          isLogin: req.session.isLogin,
          
          post_ago: getDistanceTime(d.post_date),
          post_at: getFullTime(d.post_date),
          image: '/uploads/' + d.image
        };
      });

      //let date = post_ago.getDate();

      res.render("blog", {
        isLogin: req.session.isLogin,
        blogs: newData,
        user: req.session.user,
        title: "Creating Blog Page",
      });
    });
  });
});
app.post("/blog", upload.single('image'), (req, res) => {
  let data = req.body;

  if(!req.session.isLogin){
    req.flash('danger', 'Please Login!')
    return res.redirect('/add-blog')
  }
    
    
    let post_at = new Date()
    let image = req.file.filename
  let authorId = req.session.user.id
    //post_ago: getDistanceTime(new Date())
    //post_date_ori: new Date()
 
  
  //blogs.push(data);
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(
      `INSERT INTO tb_blog(
       title, content, image, author_id,post_date )
      VALUES ( '${data.title}', '${data.content}', '${image}','${authorId}', '${post_at}' )`,
      (err, result) => {
        done();
      }
    );
    res.redirect("/blog");
  });
});
app.get("/contact", (req, res) => {
  res.render("contact", {
    isLogin: req.session.isLogin,
    user: req.session.user,
    title: "Contact Me",
  });
});

app.get("/detail-blog/:index", (req, res) => {
  let index = req.params.index;
  // let title = blogs[index].title;
  // let content = blogs[index].content;

  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(`SELECT * FROM tb_blog WHERE id=${index}`, (err, result) => {
      done();
      let data = result.rows;
      
      let newData = data.map((d) => {
        return {
          ...d,
          isLogin: req.session.isLogin,
          author: "Muhammad Hendro",
          post_ago: getDistanceTime(d.post_date),
          post_at: getFullTime(d.post_date),
          image: '/uploads/' + d.image
        };
      });

      newData = newData[0];
     
      ;
      res.render("blog-detail", { index, blog: newData, judul: "Edit Blog" });
    });
  });
});

app.get("/edit-blog/:index", (req, res) => {
  let index = req.params.index;
  // let title = blogs[index].title;
  // let content = blogs[index].content;
  

  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(`SELECT * FROM tb_blog WHERE id=${index}`, (err, result) => {
      
      let data = result.rows[0];
      
      
      
      res.render("edit-blog", { index, blogs: data, judul: "Edit Blog" });
    });
  });
});
app.post("/edit-blog/", upload.single('image'), (req, res) => {
  let data = req.body;

  let index = data.index;
  let title = data.title;
  let content = data.content;
 // let image = data.image;
 let image = req.file.filename
  //let author = "Muhammad Hendro";
  //let post_at = getFullTime(new Date());
  //ago: getDistanceTime(new Date())

  // let image = "image.png";

  //blogs.push(data);
  console.log(data)
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(
      `UPDATE tb_blog SET
       title='${title}', content='${content}', image='${image}'
      WHERE id=${index}`,
      (err, result) => {
        done();
      }
    );
    res.redirect("/blog");
  });
});

app.get("/delete-blog/:index", (req, res) => {
  let index = req.params.index;
  //index = parseInt(index) 
  // blogs.splice(index, 1);

  query = `DELETE FROM tb_blog WHERE id=${index}`
  db.connect((err, client, done) => {
    if (err) throw err;
    client.query(query, (err, result) => {
      done();
    });
  });
  res.redirect("/blog");
});



app.get("/register", (req, res) => {
  res.render("register");
});



app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  let query = `INSERT INTO tb_user(name, email, password) VALUES('${name}','${email}','${hashedPassword}')`;

  db.connect((err, client, done) => {
    if (err) throw err;
    if (!email || !name || !password) {
      req.flash("danger", "Name, Email and password must filled");
      return res.redirect("/register");
    }
    client.query(query, (err, result) => {
      if (err) throw err;
      res.redirect("/login");
    });
  });
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  let query = `SELECT * FROM tb_user WHERE email = '${email}'`;

  db.connect((err, client, done) => {
    if (err) throw err;

    client.query(query, (err, result) => {
      if (err) throw err;

      if (result.rows.length == 0) {
        req.flash("danger", "Email and password not match");
        return res.redirect("/login");
      }

      let isMatch = bcrypt.compareSync(password, result.rows[0].password);
      if (isMatch) {
        req.session.isLogin = true;
        req.session.user = {
          id: result.rows[0].id,
          name: result.rows[0].name,
          email: result.rows[0].email,
        };

        req.flash("success", "Login success");
        
        res.redirect("/blog");
      } else {
        req.flash("danger", "Email and password not match");
        res.redirect("/login");
      }
    });
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/blog");
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>ERROR 404</h1>");
});

app.listen(port, () => {
  console.log(`Server starting on port: ${port}`);
});

function getFullTime(t) {
  let time = new Date(t);
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
  let distance = timeNow - Date.parse(time);

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
    return `${distanceYear} year ago`;
  } else {
    // convert to month
    let distanceMonth = Math.floor(
      distance / (miliseconds * secondInHours * hoursInDay * daysInMonth)
    );

    if (distanceMonth >= 1) {
      return `${distanceMonth} month ago`;
    } else {
      // convert to day
      let distanceDay = Math.floor(
        distance / (miliseconds * secondInHours * hoursInDay)
      );
      if (distanceDay >= 1) {
        return `${distanceDay} day ago`;
      } else {
        // convert to hour
        let distanceHours = Math.floor(distance / (miliseconds * 60 * 60));
        if (distanceHours >= 1) {
          return `${distanceHours} hours ago`;
        } else {
          // convert to minute
          let distanceMinutes = Math.floor(distance / (miliseconds * 60));
          if (distanceMinutes >= 1) {
            return `${distanceMinutes} minutes ago`;
          } else {
            let distanceSeconds = Math.floor(distance / miliseconds);
            return `${distanceSeconds} seconds ago`;
          }
        }
      }
    }
  }
}
