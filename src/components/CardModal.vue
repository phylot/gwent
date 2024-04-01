<template>
  <div class="card-modal">
    <div class="card-modal-wrapper">
      <div class="card-modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style>
.card-modal {
  z-index: 3000;
  position: absolute;
  top: 0;
  bottom: 70px;
  left: 0;
  right: 0;
  color: #ffffff;
}

.card-modal .card-modal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.card-modal .card-modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(#000000, transparent);
}

.card-modal h2 {
  padding: 10px;
  background-color: #000000;
}

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .card-modal {
    bottom: 110px;
  }

  .card-modal h2 {
    padding: 15px;
  }
}
</style>
