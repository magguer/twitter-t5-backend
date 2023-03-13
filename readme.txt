color primario: #1d9bf0



A preguntar:

Flash 💚
Likes en profile 💚
slugify en Modelo 💚
who to card - botón follow




       <% if (user.image.includes("http")) { %>
        <img
          class="slide-bottom"
          style="
            border-radius: 100%;
            width: 70px;
            height: 70px;
            object-fit: cover;
          "
          src="<%= user.image %> "
        />
        <!--   coment -->
        <% } else {%>
        <img
          class="slide-bottom"
          style="
            border-radius: 100%;
            width: 70px;
            height: 70px;
            object-fit: cover;
          "
          src="/img/<%= user.image %>"
          alt="user-photo"
        />
        <% } %>





  tweetProfile.ejs:

        <div
  class="d-flex w-100 p-3 border-top border-succes border-opacity-50"
  style="--bs-border-opacity: "
>
  <!--     Imagen Usuario -->
  <div style="margin-right: 14px">
    <% if (userProfile.image.includes("http")) { %>
    <img
      style="width: 2.5rem"
      class="figure-img img-fluid rounded-pill align-self-center"
      alt="image"
      src="<%= userProfile.image %>"
    />
    <!--   coment -->
    <% } else {%>
    <img
      style="width: 2.5rem"
      class="figure-img img-fluid rounded-pill align-self-center"
      alt="image"
      src="/img/<%= userProfile.image %>"
    />
    <%}%>
  </div>
  <!-- Nombre y Apellido del Usuario -->
  <div class="d-flex flex-column w-100">
    <div class="d-flex align-items-center gap-1">
      <h6 class="mb-0 p-0">
        <%= userProfile.firstname %> <%= userProfile.lastname %>
      </h6>
      <small class="p-0 m-0" style="font-size: 0.8rem; color: #969696">
        @<%= userProfile.username %>
      </small>
      <small class="p-0 m-0" style="font-size: 0.8rem; color: #969696">
        <!--         comment -->
        · <%= formatDistance(new Date(), tweet.createdAt, {locale: en})%></small
      >
    </div>
    <!-- Contenido del usuario -->
    <div class="d-flex w-100">
      <p><%= tweet.text %></p>
    </div>
    <div class="d-flex justify-content-between w-100">
      <!-- Boton de Like -->
      <div class="d-flex align-items-center gap-2">
        <!--         comment -->
        <% const userLike = tweet.likes.some((u) => u.id === user.id) %>
        <!--         comment -->
        <% if (!userLike){ %>
        <!--   con el if(!userLike agrega Likes) -->
        <!-- de lo contrario if (userLike saca Likes) -->
        <form
          action="/usuarios/tweets/<%=tweet._id%>/add?_method=put"
          method="post"
        >
          <button
            type="submit"
            class="border border-white bg-white m-0 p-0 d-flex align-items-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2961/2961957.png"
              class="img-fluid object-fit"
              style="width: 1.2rem"
              alt="heart-white"
            />
          </button>
        </form>
        <% } else { %>
        <form
          action="/usuarios/tweets/<%=tweet._id%>/remove?_method=put"
          method="post"
        >
          <button
            type="submit"
            class="border border-white bg-white m-0 p-0 d-flex align-items-center"
          >
            <img
              src="https://svgur.com/i/qen.svg"
              class="img-fluid object-fit"
              style="width: 1.2rem"
              alt="heart-white"
            />
          </button>
        </form>
        <% } %>

        <h2 style="font-size: 1rem; color: #000000" class="m-0">
          <%= tweet.likes.length %>
        </h2>
      </div>
      <!-- Boton de Borrar con MethodOverride DELETE -->
      <!-- user: usuario global logeado, userProfile: el perfil del usuario q entras -->
      <% if (user.username === userProfile.username) {%>
      <form action="/usuarios/<%=tweet.id%>?_method=delete" method="post">
        <button
          type="submit"
          class="border border-white bg-white m-0 p-0 d-flex align-items-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png"
            class="img-fluid object-fit"
            style="width: 1.2rem"
            alt="trash-can"
          />
        </button>
      </form>
      <% } %>
    </div>
  </div>
  <hr />
</div>



Tweet funcional:

<div class="d-flex w-100 p-3 border-top border-succes border-opacity-50">
  <!--     Imagen Usuario -->
  <a style="margin-right: 14px" href="/usuarios/<%= tweet.user.username %>">
    <% if (userProfile.image.includes("http")) { %>
    <img
      style="width: 2.5rem"
      class="figure-img img-fluid rounded-pill align-self-center"
      alt="image"
      src="<%= tweet.user.image %>"
    />
    <!--   coment -->
    <% } else {%>
    <img
      style="width: 2.5rem"
      class="figure-img img-fluid rounded-pill align-self-center"
      alt="image"
      src="/img/<%= tweet.user.image %>"
    />
    <%}%>
  </a>
  <!-- Nombre y Apellido del Usuario -->
  <div class="d-flex flex-column w-100">
    <div class="d-flex align-items-center gap-1">
      <a
        href="/usuarios/<%= tweet.user.username %>"
        class="text-decoration-none text-black fw-semibold mb-0 p-0"
      >
        <%= tweet.user.firstname %> <%= tweet.user.lastname %>
      </a>
      <small class="p-0 m-0" style="font-size: 0.8rem; color: #969696">
        @<%= tweet.user.username %>
      </small>
      <!--       Fecha Tweet -->
      <small class="p-0 m-0" style="font-size: 0.8rem; color: #969696">
        <!--         comment -->
        · <%= formatDistance(new Date(), tweet.createdAt, {locale: en})%></small
      >
    </div>
    <!-- Contenido del usuario -->
    <div class="d-flex">
      <p><%= tweet.text %></p>
    </div>
    <div class="d-flex align-items-center justify-content-between w-100">
      <!-- Boton de Like -->
      <div class="d-flex align-items-center gap-2">
        <!--         comment -->
        <% const userLike = tweet.likes.some((u) => u.id === user.id) %>
        <!--         comment -->
        <% if (!userLike){ %>
        <!--   con el if(!userLike agrega Likes) -->
        <!-- de lo contrario if (userLike saca Likes) -->
        <form
          action="/usuarios/tweets/<%=tweet._id%>/add?_method=put"
          method="post"
        >
          <button
            type="submit"
            class="border border-white bg-white m-0 p-0 d-flex align-items-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2961/2961957.png"
              class="img-fluid object-fit"
              style="width: 1.2rem"
              alt="heart-white"
            />
          </button>
        </form>
        <% } else { %>
        <form
          action="/usuarios/tweets/<%=tweet._id%>/remove?_method=put"
          method="post"
        >
          <button
            type="submit"
            class="border border-white bg-white m-0 p-0 d-flex align-items-center"
          >
            <img
              src="https://svgur.com/i/qen.svg"
              class="img-fluid object-fit"
              style="width: 1.2rem"
              alt="heart-white"
            />
          </button>
        </form>
        <% } %>

        <h2 style="font-size: 1rem; color: #000000" class="m-0">
          <%= tweet.likes.length %>
        </h2>
      </div>
      <!-- Boton de Borrar con MethodOverride DELETE -->
      <!-- user: usuario global logeado, userProfile: el perfil del usuario q entras -->
      <% if (user.username === tweet.user.username) {%>
      <form action="/usuarios/<%=tweet._id%>?_method=delete" method="post">
        <button
          type="submit"
          class="border border-white bg-white m-0 p-0 d-flex align-items-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png"
            class="img-fluid object-fit"
            style="width: 1.2rem"
            alt="trash-can"
          />
        </button>
      </form>
      <% } %>
    </div>
  </div>
</div>









hardcore de emi:

<div class="d-flex justify-content-between mb-2">
        <div>
          <img
            class="rounded-pill"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM2nfzTwRpulizkUXNX9qrkS32qJ8JKPxqbQ&usqp=CAU"
            style="height: 2.5rem; width: 2.5rem; object-fit: cover"
            alt="Jojo"
          />
        </div>
        <div class="me-auto ms-2 mt-1">
          <h6 style="margin-bottom: -5px">Jolyne Kujo</h6>
          <small style="color: #969696; font-weight: 500"> @Ora_Ora</small>
        </div>
        <div>
          <button
            class="btn text-light"
            type="submit"
            style="border-radius: 45px; background-color: #1d9bf0"
          >
            Follow
          </button>
        </div>
      </div>
      <!-- ////////////////////////////////////////////////////////////////// -->
      <div class="d-flex justify-content-between mb-2">
        <div>
          <img
            class="rounded-pill"
            src="https://upload.wikimedia.org/wikipedia/commons/3/32/Star_Wars_-_Darth_Vader.jpg"
            style="height: 2.5rem; width: 2.5rem; object-fit: cover"
            alt="Star_Wars_-_Darth_Vader"
          />
        </div>
        <div class="me-auto ms-2 mt-1">
          <h6 style="margin-bottom: -5px">Darth Vader</h6>
          <small style="color: #969696; font-weight: 500"> @SoyTuPadre</small>
        </div>
        <div>
          <button
            class="btn text-light"
            type="submit"
            style="border-radius: 45px; background-color: #1d9bf0"
          >
            Follow
          </button>
        </div>
      </div>
      <!-- ////////////////////////////////////////////////////////////////// -->
      <div class="d-flex justify-content-between mb-2">
        <div>
          <img
            class="rounded-pill"
            src="https://i.pinimg.com/originals/c2/9b/8f/c29b8f3f7fc28e23aaeaadd45ece2593.jpg"
            style="height: 2.5rem; width: 2.5rem; object-fit: cover"
            alt="Loki"
          />
        </div>
        <div class="me-auto ms-2 mt-1">
          <h6 style="margin-bottom: -5px">Loki Odinson</h6>
          <small style="color: #969696; font-weight: 500"> @Lokillo</small>
        </div>
        <div>
          <button
            class="btn text-light"
            type="submit"
            style="border-radius: 45px; background-color: #1d9bf0"
          >
            Follow
          </button>
        </div>
      </div>
      <!-- ////////////////////////////////////////////////////////////////// -->
      <div class="d-flex justify-content-between mb-2">
        <div>
          <img
            class="rounded-pill"
            src="https://www.hollywoodinsider.com/wp-content/uploads/2020/10/Hollywood-Insider-The-Boys-Homelander.png"
            style="height: 2.5rem; width: 2.5rem; object-fit: cover"
            alt="homelander"
          />
        </div>
        <div class="me-auto ms-2 mt-1">
          <h6 style="margin-bottom: -5px">Homelander</h6>
          <small style="color: #969696; font-weight: 500"
            >@Saving_America</small
          >
        </div>
        <div>
          <button
            class="btn text-light"
            type="submit"
            style="border-radius: 45px; background-color: #1d9bf0"
          >
            Follow
          </button>
        </div>
      </div>
      <!-- ////////////////////////////////////////////////////////////////// -->
      <div class="d-flex justify-content-between mb-2">
        <div>
          <img
            class="rounded-pill"
            src="https://pbs.twimg.com/profile_images/1410016832048746498/7nb0zbG6_400x400.jpg"
            style="height: 2.5rem; width: 2.5rem; object-fit: cover"
            alt="ROSA"
          />
        </div>
        <div class="me-auto ms-2 mt-1">
          <h6 style="margin-bottom: -5px">R O S A L Í A</h6>
          <small style="color: #969696; font-weight: 500">@rosalia</small>
        </div>
        <div>
          <button
            class="btn text-light"
            type="submit"
            style="border-radius: 45px; background-color: #1d9bf0"
          >
            Follow
          </button>
        </div>
      </div>