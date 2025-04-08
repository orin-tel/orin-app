import { IStateTreeNode, SnapshotIn } from "mobx-state-tree"

// This custom type helps TS know what properties can be modified by our returned function. It excludes actions and views, but still correctly infers model properties for auto-complete and type safety.
type OnlyProperties<T> = {
  [K in keyof SnapshotIn<T>]: K extends keyof T ? T[K] : never
}

/**
 * If you include this in your model in an action() block just under your props,
 * it'll allow you to set property values directly while retaining type safety
 * and also is executed in an action. This is useful because often you find yourself
 * making a lot of repetitive setter actions that only update one prop.
 *
 * E.g.:
 *
 *  const UserModel = types.model("User")
 *    .props({
 *      name: types.string,
 *      age: types.number
 *    })
 *    .actions(withSetPropAction)
 *
 *   const user = UserModel.create({ name: "Jamon", age: 40 })
 *
 *   user.setProp("name", "John") // no type error
 *   user.setProp("age", 30)      // no type error
 *   user.setProp("age", "30")    // type error -- must be number
 */
export const withSetPropAction = <T extends IStateTreeNode>(mstInstance: T) => ({
  setProp<K extends keyof OnlyProperties<T>, V extends SnapshotIn<T>[K]>(field: K, newValue: V) {
    ;(mstInstance as T & OnlyProperties<T>)[field] = newValue
  },
})
