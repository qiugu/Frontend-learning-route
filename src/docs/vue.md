1.vue中父子组件的生命周期执行顺序
- 挂载阶段：父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted
- 更新阶段：父beforeUpdate->子beforeUpdate->子updated->父updated
- 销毁阶段：父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
