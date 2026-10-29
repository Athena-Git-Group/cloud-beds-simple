import { useEffect, useState } from 'react'
import { Drawer, Field } from '../ui/Drawer'
import { Button } from '../ui/primitives'
import { IconArrowRight, IconCheck, IconPencil } from '../ui/Icon'
import { cn } from '../../lib/cn'
import { CONDITION_TONE, FRONTDESK_TONE } from '../../domain/semantics'
import type { Condition } from '../../domain/types'
import { useRoom, useStore } from '../../domain/store'
import { roomLabel } from '../../domain/mock'
import { useI18n } from '../../i18n'

const CONDITIONS: Condition[] = ['dirty', 'clean', 'inspected', 'out_of_service']

/**
 * Opened by clicking a room row on the Calendar or Housekeeping table.
 * Lets staff update housekeeping state in place while the grid stays visible.
 */
export function UnitDetailPanel({ roomId, onClose }: { roomId: string | null; onClose: () => void }) {
  const { t } = useI18n()
  const room = useRoom(roomId)
  const { housekeepers, setCondition, assignHousekeeper, toggleDnd, setComments } = useStore()

  const [editingNote, setEditingNote] = useState(false)
  const [draftNote, setDraftNote] = useState('')

  useEffect(() => {
    setEditingNote(false)
    setDraftNote(room?.comments ?? '')
  }, [room?.id, room?.comments])

  return (
    <Drawer
      open={!!room}
      onClose={onClose}
      accent={room ? CONDITION_TONE[room.condition].bar : undefined}
      title={room ? roomLabel(t, room) : ''}
      subtitle={room ? `${t(`roomType.${room.typeId}`)} · ${t('common.floor', { n: room.floor })}` : undefined}
      footer={
        room && (
          <button className="flex w-full items-center justify-between text-sm font-semibold text-brand-700 hover:text-brand-800">
            {t('unit.openSettings')}
            <IconArrowRight className="h-4 w-4" />
          </button>
        )
      }
    >
      {room && (
        <div className="divide-y divide-fog-100">
          <Field label={t('unit.condition')}>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map((c) => {
                const tone = CONDITION_TONE[c]
                const active = room.condition === c
                return (
                  <button
                    key={c}
                    onClick={() => setCondition([room.id], c)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                      active ? cn(tone.chip, 'border-transparent') : 'border-fog-200 text-ink-soft hover:bg-fog-50',
                    )}
                  >
                    <span className={cn('h-2.5 w-2.5 rounded-full', tone.dot)} />
                    {t(`cond.${c}`)}
                    {active && <IconCheck className="ml-auto h-4 w-4" />}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label={t('unit.roomStatus')}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">{t(`roomStatus.${room.roomStatus}`)}</span>
              {room.roomStatus === 'occupied' && (
                <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
                  <span>{t('unit.doNotDisturb')}</span>
                  <button
                    onClick={() => toggleDnd(room.id)}
                    className={cn('relative h-5 w-9 rounded-full transition-colors', room.doNotDisturb ? 'bg-brand-600' : 'bg-fog-300')}
                    role="switch"
                    aria-checked={room.doNotDisturb}
                  >
                    <span
                      className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', room.doNotDisturb ? 'translate-x-4' : 'translate-x-0.5')}
                    />
                  </button>
                </label>
              )}
            </div>
          </Field>

          <Field label={t('unit.frontDeskStatus')}>
            <div className="flex items-center gap-2">
              <span className={cn('h-2.5 w-2.5 rounded-full', FRONTDESK_TONE[room.frontDeskStatus].dot)} />
              <span className="text-sm font-semibold text-ink">{t(`fd.${room.frontDeskStatus}`)}</span>
              {room.arrivalTime && (
                <span className="ml-auto text-sm text-ink-soft">{t('unit.arrival', { time: room.arrivalTime })}</span>
              )}
            </div>
          </Field>

          <Field label={t('unit.assignedTo')}>
            <select
              value={room.assignedTo ?? ''}
              onChange={(e) => assignHousekeeper([room.id], e.target.value || null)}
              className="h-9 w-full rounded-lg border border-fog-200 bg-white px-3 text-sm text-ink focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">{t('common.unassigned')}</option>
              {housekeepers.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('unit.comments')}>
            {editingNote ? (
              <div>
                <textarea
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-fog-200 p-2.5 text-sm text-ink focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder={t('unit.addNote')}
                />
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setComments(room.id, draftNote)
                      setEditingNote(false)
                    }}
                  >
                    {t('common.save')}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingNote(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setEditingNote(true)}
                className="group flex w-full items-start gap-2 rounded-lg p-2 text-left hover:bg-fog-50"
              >
                <span className={cn('flex-1 text-sm', room.comments ? 'text-ink' : 'text-ink-faint italic')}>
                  {room.comments || t('unit.noNotes')}
                </span>
                <IconPencil className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint opacity-0 group-hover:opacity-100" />
              </button>
            )}
          </Field>
        </div>
      )}
    </Drawer>
  )
}
