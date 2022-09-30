<script></script>

<template>
  <div
    class="py-5 pl-6 flex hover:bg-gray-600 rounded-r-full w-11/12 cursor-pointer text-emerald-400"
  >
    <a href="#my-modal-2" class="flex">
      <div class="mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      <div>Create New Board</div></a
    >
  </div>

  <div class="modal" id="my-modal-2">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Congratulations random Internet user!</h3>
      <p class="py-4">
        You've been selected for a chance to get one year of subscription to use
        Wikipedia for free!
      </p>
      <div class="modal-action">
        <a href="#" class="btn">Yay!</a>
      </div>
    </div>
  </div>
</template>
