"use client"

import { useState } from "react"
import { Loader2, Plus, X } from "lucide-react"
import { DatePicker, Form, Input, InputNumber, message, Modal } from "antd"
import type { Dayjs } from "dayjs"

import { Button } from "@/components/client/ui/button"
import { GOAL_NAME_MAX_LENGTH } from "@/constants/goals"
import { CURRENCY_SYMBOL } from "@/constants/money"
import { useGoalActions } from "@/hooks/use-goals"
import { toMinorUnits } from "@/lib/money"

type GoalFormValues = {
  name: string
  targetAmount?: number | null
  targetDate?: Dayjs | null
}

function fieldLabel(label: string, optional = false) {
  return (
    <span className="text-xs font-medium text-text-muted">
      {label}
      {optional && <span className="font-normal text-text-muted/70"> (optional)</span>}
    </span>
  )
}

export function AddGoalModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [form] = Form.useForm<GoalFormValues>()
  const { createGoal } = useGoalActions()
  const [messageApi, contextHolder] = message.useMessage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleFinish(values: GoalFormValues) {
    const targetAmount =
      typeof values.targetAmount === "number"
        ? toMinorUnits(values.targetAmount)
        : undefined
    const targetDate = values.targetDate
      ? values.targetDate.format("YYYY-MM-DD")
      : undefined

    setIsSubmitting(true)
    try {
      await createGoal({
        name: values.name.trim(),
        targetAmount,
        targetDate,
      })
      messageApi.success("Goal created")
      form.resetFields()
      onClose()
    } catch (error) {
      messageApi.error(
        error instanceof Error ? error.message : "Could not create the goal.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCancel() {
    if (isSubmitting) return
    form.resetFields()
    onClose()
  }

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={<span className="sr-only">Add goal</span>}
        footer={null}
        closable={false}
        centered
        width={540}
        onCancel={handleCancel}
        destroyOnHidden
        classNames={{
          header: "hidden!",
          body: "p-0!",
          container: "overflow-hidden rounded-2xl!",
        }}
      >
        <div className="flex flex-col gap-6 p-6 sm:p-7">
          <header className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-text-primary">
                What are you saving for?
              </h2>
              <p className="text-sm text-text-muted">
                A name is all you need. Add a target to track progress.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close add goal dialog"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X aria-hidden="true" />
            </Button>
          </header>

          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleFinish}
            className="flex flex-col gap-5"
          >
            <Form.Item
              name="name"
              className="mb-0!"
              label={fieldLabel("Goal name")}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Enter a goal name.",
                },
                {
                  max: GOAL_NAME_MAX_LENGTH,
                  message: `Keep the name under ${GOAL_NAME_MAX_LENGTH} characters.`,
                },
              ]}
            >
              <Input
                size="large"
                autoFocus
                maxLength={GOAL_NAME_MAX_LENGTH}
                placeholder="e.g. Emergency fund"
              />
            </Form.Item>

            <div className="grid gap-5 sm:grid-cols-2">
              <Form.Item
                name="targetAmount"
                className="mb-0!"
                label={fieldLabel("Target amount", true)}
                rules={[
                  {
                    type: "number",
                    min: 0.01,
                    message: "Enter an amount greater than zero.",
                  },
                ]}
              >
                <InputNumber
                  size="large"
                  prefix={CURRENCY_SYMBOL}
                  min={0.01}
                  precision={2}
                  step={10}
                  controls={false}
                  className="w-full font-mono"
                  placeholder="0.00"
                />
              </Form.Item>

              <Form.Item
                name="targetDate"
                className="mb-0!"
                label={fieldLabel("Target date", true)}
              >
                <DatePicker
                  size="large"
                  className="w-full"
                  format="MMM d, yyyy"
                  placeholder="No deadline"
                />
              </Form.Item>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border-default pt-5">
              <Button
                type="button"
                variant="ghost"
                className="h-10 px-4"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                  <Plus aria-hidden="true" />
                )}
                {isSubmitting ? "Creating…" : "Create goal"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  )
}
